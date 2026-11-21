# K Arch Architects — Fullstack React & Node.js Website + CMS

A bespoke, high-performance web platform and Content Management System built for **K Arch Architects** ([karcharchitects.com](https://karcharchitects.com/)), Mumbai.

---

## 🚀 Key Highlights & New Architecture

### 1. Fullstack React + Node.js Architecture
- **Frontend**: Modern **React 18 + Vite** with high-end editorial architectural typography (*Playfair Display*, *Plus Jakarta Sans*, *JetBrains Mono*).
- **Backend API**: **Node.js + Express** with file streaming, JSON persistence, and dynamic asset serving.
- **Port**: Serves on `http://localhost:5500` (or `process.env.PORT`).

### 2. Team In-Page Modal (No Separate Window / No New Tab)
- Clicking on either leadership card (**Ar. Pravin Eknath Khade** or **Mrs. Prajakta Khade**) opens their full executive biography, credentials, philosophy, and landmark projects **right on the same page** in an interactive luxury modal with backdrop blur.

### 3. Executive CMS Portal: `/pravinadmin` (Zero Login Required!)
- Direct access at: `http://localhost:5500/pravinadmin` (or `https://your-app.onrender.com/pravinadmin`).
- No password or login wall required — direct and frictionless for the client.
- **Upload New Projects**:
  - Drag & drop or select photos directly from phone/laptop.
  - Set Title, Category (*Skyscrapers, Residential, Commercial, Township, Luxury Interiors*), Location, Status, and Typology.
  - One-click **"Publish Project to Website"**.
  - Newly uploaded projects immediately appear live on the homepage with a **`✨ New Upload`** badge!
- **Manage Existing Projects**:
  - Search and delete projects with instant live synchronization.

### 4. Dynamic Live Portfolio (92+ Landmarks)
- Real-time search by location or project name.
- Category filters (*Skyscrapers & High-Rise, Residential Towers, Commercial Complex, Township Planning, Luxury Interiors, 3D Architecture*).
- Interactive project lightbox with high-resolution imagery and inquiry call-to-actions.

### 5. Categorized Ecosystem & Work Partners (52+ Logos)
- Real Estate Developers, Structural Consultants, Approval Authority Architects, MEP Liaisons, Environmental Consultants, Landscape Architects, PMC, and Sales Marketing Consultants.

---

## 🛠️ Local Development & Running

```bash
# 1. Install dependencies
npm install

# 2. Build React production bundle
npm run build

# 3. Start the Fullstack Server
npm start
```

- **Main Website**: [http://localhost:5500/](http://localhost:5500/)
- **Admin CMS Dashboard**: [http://localhost:5500/pravinadmin](http://localhost:5500/pravinadmin)

---

## 🌐 Deploy to Render

### As a Web Service (Full Node + React Backend)
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Select your repository: `KartikShende21/Client1`.
4. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Create Web Service**.

Both the main React website and the `/pravinadmin` upload dashboard will be live!
