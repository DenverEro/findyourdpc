# findyourdpc.com | Scalable Project DNA (2026)

## 🧬 Project Mission
A multi-state, consumer-friendly directory and educational resource for Direct Primary Care. The platform must scale from a Michigan/Ohio regional focus to a nationwide infrastructure without architectural refactoring.

## 🎨 Visual Identity & UI Standards
- **Aesthetic:** "Medical-Modern" — professional, airy, and high-trust.
- **Palette:** 
  - Primary: Teal/Mint (#88C9C4) for actions and brand accents.
  - Secondary: Deep Navy (#1A2B3C) for headers and trust-based footers.
  - Background: Soft White (#F9FBFA).
- **Geometry:** `border-radius: 16px` on all cards; generous whitespace; responsive grid layout.
- **Responsive:** Mobile-First (one-handed thumb navigation for search and filters).

## 🛠️ Tech Stack & Architecture
- **Frontend:** React / Next.js (Tailwind CSS).
- **Data Strategy:** Modular JSON-driven architecture. 
  - Data resides in `/data/[state_code].json`.
  - Application logic must dynamically ingest these files based on route/context.
- **Scalability Rule:** Never hardcode state-specific logic into components. Use a `StateProvider` or similar pattern to handle regional content.

## ⚖️ 2026 Compliance Directives (OBBBA)
- **HSA-Eligibility:** Every doctor listing must show an "HSA-Compliant" badge **ONLY** if:
  1. Individual membership is ≤ $150/mo.
  2. Family membership is ≤ $300/mo.
  3. No visit-based co-pays are charged.
- **Verification:** Agents must verify these thresholds against the active JSON data before rendering badges.

## 📝 Content & SEO Voice
- **Tone:** Empathetic Peer (Avoid cold, clinical jargon).
- **Keywords:** "Direct Primary Care," "HSA-Compliant Doctor," "[City] DPC."
- **CTAs:** Every blog or resource page must link to the directory search for the relevant state.

## 🚫 Forbidden Actions
- **No Hardcoding:** Do not hardcode practice details or city lists into the UI.
- **No Desktop-First:** Do not generate layout code that isn't tested for mobile viewports.
- **No Manual Imports:** Do not manually import state data; use dynamic fetching/mapping.
