
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 4004;

// Initialize Stripe and Resend
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());

// --- Webhook Endpoint (Must be before express.json) ---
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            const practiceId = subscription.metadata?.practiceId;

            if (practiceId) {
                console.log(`[WEBHOOK] Subscription deleted for practice: ${practiceId}. Reverting changes.`);
                // Remove from in-memory store (Reverts to original unclaimed state)
                providers.delete(practiceId);
            } else {
                console.warn('[WEBHOOK] Subscription deleted but no practiceId found in metadata.');
            }
            break;
        default:
            console.log(`[WEBHOOK] Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// In-memory store for verification codes (Replace with DB for production)
const verificationCodes = new Map();
const users = new Map(); // email -> { passwordHash, practiceId }
const resetTokens = new Map(); // token -> email

// --- Middleware ---
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

// --- 1. NPI Verification Proxy ---
app.get('/api/verify-npi/:npi', async (req, res) => {
    try {
        const { npi } = req.params;
        const response = await fetch(`https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`);
        const data = await response.json();

        if (data.result_count === 0) {
            return res.status(404).json({ error: 'NPI not found' });
        }

        const primaryCareTaxonomies = ['Family Medicine', 'Internal Medicine', 'Pediatrics', 'General Practice'];
        const doctorData = data.results[0];
        const hasTaxonomy = doctorData.taxonomies.some(t =>
            primaryCareTaxonomies.some(p => t.desc.includes(p))
        );

        if (!hasTaxonomy) {
            return res.status(400).json({ error: 'NPI does not have a primary care taxonomy' });
        }

        res.json({
            success: true,
            name: `${doctorData.basic.first_name} ${doctorData.basic.last_name}`,
            practiceName: doctorData.practice_locations?.[0]?.address_1 || 'Unknown'
        });
    } catch (error) {
        console.error('NPI Verification Error:', error);
        res.status(500).json({ error: 'Failed to verify NPI', details: error.message });
    }
});

// --- 2. Send Verification Code ---
app.post('/api/send-code', async (req, res) => {
    const { email, clinicName } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiry (30 mins)
    verificationCodes.set(email, { code, expires: Date.now() + 30 * 60 * 1000 });

    try {
        // In production, uncomment this to send real emails
        /*
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Verify your Find Your DPC practice claim',
          html: `<p>Your verification code for <strong>${clinicName}</strong> is: <strong>${code}</strong></p><p>This code expires in 30 minutes.</p>`
        });
        */

        console.log(`[DEV] Verification code for ${email}: ${code}`);
        res.json({ success: true, message: 'Code sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send verification email' });
    }
});

// --- 3. Verify Code ---
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    const entry = verificationCodes.get(email);

    if (!entry || entry.code !== code || Date.now() > entry.expires) {
        return res.status(400).json({ error: 'Invalid or expired code' });
    }

    verificationCodes.delete(email);
    res.json({ success: true });
});

// --- 4. Stripe Checkout ---
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            metadata: {
                practiceId: req.body.practiceId
            },
            subscription_data: {
                metadata: {
                    practiceId: req.body.practiceId
                }
            },
            success_url: `${process.env.CLIENT_URL}/#/claim-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/#/claim-failed`,
        });

        console.log(`[SUCCESS] Created Stripe Session: ${session.id}`);
        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error(`[ERROR] Stripe Session Creation failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// --- 5. Verify Checkout Session ---
app.post('/api/verify-checkout-session', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            res.json({
                success: true,
                customer_email: session.customer_details.email,
                practiceId: session.metadata.practiceId
            });
        } else {
            res.json({ success: false, status: session.payment_status });
        }
    } catch (error) {
        console.error('Error verifying session:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- 5.5 Authentication Routes ---

app.post('/api/register', async (req, res) => {
    const { email, password, practiceId } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    users.set(email, { passwordHash, practiceId });
    console.log(`[AUTH] Registered user ${email} for practice ${practiceId}`);

    // Generate Token
    const token = jwt.sign({ email, practiceId }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ success: true, token });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.get(email);

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ email, practiceId: user.practiceId }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, practiceId: user.practiceId });
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = users.get(email);
    if (!user) return res.status(404).json({ error: 'Email not found' });

    const token = Math.random().toString(36).substring(2, 15);
    resetTokens.set(token, email);

    // Send email (Mocked for dev unless keys present)
    const resetLink = `${process.env.CLIENT_URL}/#/reset-password?token=${token}`;
    console.log(`[AUTH] Reset link for ${email}: ${resetLink}`);

    try {
        /*
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Reset Password - Find Your DPC',
            html: `<p>Click here to reset your password: <a href="${resetLink}">Reset Password</a></p>`
        });
        */
        res.json({ success: true, message: 'Reset link sent' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const email = resetTokens.get(token);

    if (!email) return res.status(400).json({ error: 'Invalid or expired token' });

    const user = users.get(email);
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    resetTokens.delete(token);
    res.json({ success: true, message: 'Password updated' });
});

// --- 6. Provider Portal API ---

// In-memory store for provider overrides (database mock)
const providers = new Map();

app.get('/api/provider/:id', (req, res) => {
    const { id } = req.params;
    const providerData = providers.get(id) || {};
    res.json(providerData);
});

app.put('/api/provider/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Merge existing data with updates
    const currentData = providers.get(id) || {};
    const newData = { ...currentData, ...updates, updatedAt: new Date().toISOString() };

    providers.set(id, newData);
    res.json({ success: true, data: newData });
});

app.get('/api/provider/:id/subscription', async (req, res) => {
    // In a real app, we'd query Stripe for the customer ID linked to this practice
    // For MVP, we'll verify they have an active session cookie or just mock it
    res.json({
        status: 'active',
        plan: 'Practice Listing Monthly',
        amount: 50.00,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
});

// --- Contact Form Endpoint ---
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        // Send email via Resend
        await resend.emails.send({
            from: 'hello@findyourdpc.com',
            to: 'hello@findyourdpc.com',
            subject: `Contact Form: ${subject} - from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">New Contact Form Submission</h2>
                    <p style="font-size: 16px; color: #333;"><strong>From:</strong> ${name}</p>
                    <p style="font-size: 16px; color: #333;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p style="font-size: 16px; color: #333;"><strong>Subject:</strong> ${subject}</p>
                    <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #059669; border-radius: 4px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 10px;"><strong>Message:</strong></p>
                        <p style="font-size: 16px; color: #333; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                        Sent from findyourdpc.com contact form
                    </p>
                </div>
            `,
            replyTo: email
        });

        console.log(`[CONTACT] Form submitted by ${name} (${email}) - Subject: ${subject}`);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('[CONTACT] Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// --- Debug GET handler for Checkout ---
app.get('/api/create-checkout-session', (req, res) => {
    console.warn(`[WARN] RECEIVED GET REQUEST TO create-checkout-session at ${new Date().toISOString()}`);
    console.warn('Headers:', JSON.stringify(req.headers, null, 2));
    res.status(405).json({
        error: 'Please use POST method for this endpoint.',
        hint: 'The frontend code should be using method: POST. If you see this, a browser or tool is making an accidental GET request.'
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Force restart for syntax check
