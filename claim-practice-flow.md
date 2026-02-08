# Claim Your Practice - Feature Specification

Implement a "Claim Your Practice" feature for Find Your DPC. Here's the complete flow from a provider's perspective:

---

## Step 1: Initiate Claim

- Provider clicks "Claim This Practice" on a clinic listing page
- System checks if already claimed → if yes, show "Already claimed, contact support"
- If unclaimed, show claim form asking for NPI number and practice email address for verification code

---

## Step 2: NPI Verification
- Call the NPI Registry API: `https://npiregistry.cms.hhs.gov/api/?number={NPI}&version=2.1`
- Validate the response: must be a valid NPI with primary care taxonomy (Family Medicine, Internal Medicine, Pediatrics, or General Practice)
- Match returned data (name, address) against our clinic listing
- If mismatch, show "Please verify your NPI matches this clinic"
- Extract the practice website domain from the listing or NPI data

---

## Step 3: Email Verification

- Generate a 6-digit verification code
- Send email with code to email address provided in step 1
- Email subject: "Verify your Find Your DPC practice claim"
- Show input field for provider to enter the code
- Validate code, expire after 30 minutes
- Allow resend after 60 seconds

---

## Step 4: Account Creation

- Prompt for email and password to create account
- This can be any email (doesn't have to match the domain)
- Link account to the claimed practice

---

## Step 5: Checkout
- Add "Practice Listing Subscription" to cart ($X/month or year)
- Collect payment via Stripe
- On payment success, mark practice as "claimed"

---

## Step 6: Confirmation

- Show success message with link to provider portal
- Send confirmation email with portal login link
- Allow provider to immediately edit their practice profile

---

## Tech Notes
- Use environment variables for email service credentials (Resend, SendGrid, or AWS SES)
- Store NPI data and verification status in database
- Handle errors gracefully with user-friendly messages
- Email verification is MVP — voice/SMS can be added later when justified by volume