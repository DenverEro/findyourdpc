const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const { Resend } = require('resend');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 4004;

// Safe init
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// DEBUG
const distPath = path.join(process.cwd(), 'dist');
console.log('=== DEBUG ===');
console.log('__dirname:', __dirname);
console.log('distPath:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
if (fs.existsSync(distPath)) {
  console.log('dist contents:', fs.readdirSync(distPath));
}
console.log('=============');

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Stores
const verificationCodes = new Map();
const users = new Map();
const resetTokens = new Map();
const providers = new Map();

// Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/verify-npi/:npi', async (req, res) => {
  try {
    const { npi } = req.params;
    const response = await fetch(`https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`);
    const data = await response.json();
    if (data.result_count === 0) return res.status(404).json({ error: 'NPI not found' });
    const doctorData = data.results[0];
    const primaryCareTaxonomies = ['Family Medicine', 'Internal Medicine', 'Pediatrics', 'General Practice'];
    const hasTaxonomy = doctorData.taxonomies.some(t => primaryCareTaxonomies.some(p => t.desc.includes(p)));
    if (!hasTaxonomy) return res.status(400).json({ error: 'NPI does not have a primary care taxonomy' });
    res.json({
      success: true,
      name: `${doctorData.basic.first_name} ${doctorData.basic.last_name}`,
      practiceName: doctorData.practice_locations?.[0]?.address_1 || 'Unknown'
    });
  } catch (error) {
    console.error('NPI Error:', error);
    res.status(500).json({ error: 'Failed to verify NPI' });
  }
});

app.post('/api/send-code', async (req, res) => {
  const { email, clinicName } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, { code, expires: Date.now() + 30 * 60 * 1000 });
  if (resend) {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your Find Your DPC practice claim',
      html: `<p>Your verification code for <strong>${clinicName}</strong> is: <strong>${code}</strong></p>`
    });
  }
  console.log(`[DEV] Code for ${email}: ${code}`);
  res.json({ success: true });
});

app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  const entry = verificationCodes.get(email);
  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }
  verificationCodes.delete(email);
  res.json({ success: true });
});

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      metadata: { practiceId: req.body.practiceId },
      success_url: `${process.env.CLIENT_URL}/#/claim-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/#/claim-failed`,
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-checkout-session', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      res.json({ success: true, customer_email: session.customer_details.email, practiceId: session.metadata.practiceId });
    } else {
      res.json({ success: false, status: session.payment_status });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, practiceId } = req.body;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  users.set(email, { passwordHash, practiceId });
  const token = jwt.sign({ email, practiceId }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email, practiceId: user.practiceId }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token, practiceId: user.practiceId });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'All fields required' });
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return res.status(400).json({ error: 'Invalid email' });
  if (resend) {
    await resend.emails.send({
      from: 'hello@findyourdpc.com',
      to: 'hello@findyourdpc.com',
      subject: `Contact: ${subject} - ${name}`,
      html: `<h2>New Contact</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`,
      replyTo: email
    });
  }
  console.log(`[CONTACT] ${name} (${email}): ${subject}`);
  res.json({ success: true, message: 'Sent!' });
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' });
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const practiceId = subscription.metadata?.practiceId;
      if (practiceId) providers.delete(practiceId);
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.get('/api/provider/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  res.json(providers.get(id) || {});
});

app.put('/api/provider/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const current = providers.get(id) || {};
  const newData = { ...current, ...updates, updatedAt: new Date().toISOString() };
  providers.set(id, newData);
  res.json({ success: true, data: newData });
});

app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
  }
}));

app.get('*', (req, res) => {
  if (req.path.match(/\.(js|css|png|jpg|svg|ico)$/)) return res.status(404).json({ error: 'Asset not found' });
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`[SERVER] Running on port ${port}`);
});
EOF
```

**Push:**
```
git add server.js package.json
git commit -m "Add CJS server.js for Hostinger"
git push origin main
```

**Hostinger:** Entry: server.js, Node 20.x, redeploy.

Attach this server.js to email. 🚀<|control12|><xai:function_call name="message">
<parameter name="action">send