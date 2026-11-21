# K Arch Architects — Luxury Architecture Studio Website

A modern, high-performance web experience for **K Arch Architects** ([karcharchitects.com](https://karcharchitects.com/)), designed for high-end real estate developers, structural consultants, and prospective clients.

## 🚀 Key Features
- **Luxury Day Mode**: Gallery-grade white backdrop, Plus Jakarta Sans & Playfair Display typography, subtle shadow elevations, and architectural bronze accents.
- **Preloader Animation**: Exact branded preloader featuring the logo, tagline *"DESIGN YOUR SPACE WITH OUR CREATIONS"*, and 5 signature pulsing color dots (Yellow, Orange, Red, Purple, Green).
- **Streamlined Navigation**: Clean top navbar with Company dropdown (`About Us`, `Philosophy`, `Core Leadership`), `Services`, `Portfolio`, `Clients & Partners`, and `Contact Us`.
- **Ecosystem Collaborators (52 Logos)**: Interactive categorized sections for Real Estate Developers, Structural Consultants, Approval Authority Architects, MEP Consultants, Environmental Consultants, Landscape Architects, PMC, and Project Sales Marketing Consultants.
- **Dedicated Executive Profiles**: Standalone detail profile pages for Ar. Pravin Eknath Khade (`team-pravin-khade.html`) and Mrs. Prajakta Khade (`team-prajakta-khade.html`) opening in new tabs.
- **Filterable Portfolio (92 Projects)**: Real-time search, category filters (Skyscrapers, Residential, Commercial, Township, 3D Interiors), and lightbox modal.

---

## 📁 Project Structure

```
├── dist/                      # Production build for Render deployment
│   ├── index.html             # Main entry point
│   ├── team-pravin-khade.html # Ar. Pravin Khade biography & portfolio
│   ├── team-prajakta-khade.html# Mrs. Prajakta Khade interior portfolio
│   ├── _redirects             # Static redirects configuration
│   └── assets/                # CSS, JS, and image assets
├── assets/                    # Source assets (CSS, JS, images)
├── index.html                 # Main website template
├── team-pravin-khade.html     # Ar. Pravin Khade biography
├── team-prajakta-khade.html   # Mrs. Prajakta Khade interior profile
├── package.json               # Build scripts & metadata
├── render.yaml                # Render Blueprint deployment configuration
└── build.js                   # Automated build & dist generator
```

---

## 🌐 Deploy to Render (Static Site)

### Option 1: Automatic Blueprint (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository: `KartikShende21/Client1`.
4. Render will automatically detect `render.yaml` and configure everything.
5. Click **Apply**. Your website will be live in ~1 minute!

### Option 2: Manual Static Site Setup
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Static Site**.
3. Select your repository: `KartikShende21/Client1`.
4. Configure settings:
   - **Name**: `karch-architects`
   - **Branch**: `main`
   - **Build Command**: `node build.js` (or leave empty)
   - **Publish Directory**: `dist`
5. Click **Create Static Site**.

---

## 💻 Local Development
```bash
# Build the dist directory
npm run build

# Start local server
python -m http.server 5500
# or
npm start
```
Open [http://localhost:5500/](http://localhost:5500/) in your browser.
