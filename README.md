# findyourdpc.com | Michigan DPC Directory 🩺

A high-performance, consumer-friendly directory and educational resource for **Direct Primary Care (DPC)**. This platform connects patients with affordable, transparent, and membership-based healthcare providers, starting with a focus on Michigan.

## 🚀 Vision
To decentralize the primary care search experience, providing patients with clear pricing, doctor accessibility, and HSA-compliance verification without the clutter of traditional insurance-based directories.

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (v4 integration pending; currently via polished CDN patterns)
- **Data Strategy**: Modular JSON-driven architecture (`/data/[state_code].json`)

## 🏁 Getting Started
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Development**:
   ```bash
   npm run dev
   ```
3. **Build**:
   ```bash
   npm run build
   ```

## ⚖️ 2026 OBBBA Compliance (HSA Eligibility)
Every listing is verified against the 2026 HSA-Eligibility thresholds:
- Individual Membership ≤ $150/mo
- Family Membership ≤ $300/mo
- $0 Visit-based co-pays

## 📂 Project Structure
- `/data`: Source of truth for DPC practice listings.
- `/pages`: Core views including Home, Directory, and Practice Details.
- `/components`: Premium UI elements following the "Medical-Modern" design system.
- `/docs`: Architectural decisions and implementation plans.

## 📄 License
Copyright (C) 2026 Seven. Licensed under the GNU General Public License v3.0.
