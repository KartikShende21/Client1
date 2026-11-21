const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data and uploads directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const projectsFile = path.join(dataDir, 'projects.json');
const partnersFile = path.join(dataDir, 'partners.json');

// Helper to read projects
function getProjects() {
  try {
    if (fs.existsSync(projectsFile)) {
      return JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading projects.json:', err);
  }
  return [];
}

// Helper to save projects
function saveProjects(projects) {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2), 'utf8');
}

// Multer storage config for uploaded photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif|svg/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, AVIF, SVG) are permitted!'));
    }
  }
});

// Serve static folders
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'dist')));

/* ==========================================================================
   API ROUTES
   ========================================================================== */

// 1. Get all projects
app.get('/api/projects', (req, res) => {
  const projects = getProjects();
  res.json(projects);
});

// 2. Upload new project photo & details (from /pravinadmin)
app.post('/api/projects', upload.single('photo'), (req, res) => {
  try {
    const { title, category, location, typology, description, status, badge } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project Title is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Project Photo is required' });
    }

    const projects = getProjects();
    const newId = Date.now();
    const photoUrl = `/uploads/${req.file.filename}`;

    const categoryMap = {
      skyscrapers: 'Skyscrapers & High-Rise',
      residential: 'Residential Tower',
      commercial: 'Commercial Complex',
      township: 'Township Planning',
      interiors: 'Luxury Interiors',
      '3d_interiors': '3D Interior Architecture'
    };

    const selectedCat = category || 'skyscrapers';
    const catName = categoryMap[selectedCat] || 'Architectural Landmark';

    const newProject = {
      id: newId,
      title: title.trim(),
      category: selectedCat,
      categoryName: catName,
      type: typology || catName,
      location: location ? location.trim() : 'Mumbai, India',
      status: status || 'Upcoming Landmark',
      badge: badge || 'New Project',
      image: photoUrl,
      originalImage: photoUrl,
      description: description ? description.trim() : `Designed by K Arch Architects under Principal Architect Ar. Pravin Eknath Khade.`,
      isCustomUpload: true,
      createdAt: new Date().toISOString()
    };

    // Prepend to array so newest uploaded projects show first on the website!
    projects.unshift(newProject);
    saveProjects(projects);

    console.log(`✅ [New Upload] Project added: "${newProject.title}" (${photoUrl})`);
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ error: 'Failed to save project: ' + err.message });
  }
});

// 3. Delete a project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const projects = getProjects();
    const idx = projects.findIndex(p => p.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const removed = projects.splice(idx, 1)[0];
    saveProjects(projects);

    // Delete uploaded image if located in uploads/
    if (removed.image && removed.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, removed.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    console.log(`🗑️ [Deleted] Project removed: "${removed.title}" (ID: ${id})`);
    res.json({ success: true, removed });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// 4. Get Partners
app.get('/api/partners', (req, res) => {
  try {
    if (fs.existsSync(partnersFile)) {
      const data = JSON.parse(fs.readFileSync(partnersFile, 'utf8'));
      return res.json(data);
    }
  } catch (err) {
    console.error('Error reading partners.json:', err);
  }
  res.json({});
});

// 5. Stats summary for admin dashboard
app.get('/api/stats', (req, res) => {
  const projects = getProjects();
  const customCount = projects.filter(p => p.isCustomUpload).length;
  res.json({
    totalProjects: projects.length,
    customUploads: customCount,
    categories: ['skyscrapers', 'residential', 'commercial', 'township', 'interiors']
  });
});

/* ==========================================================================
   ADMIN CMS DASHBOARD: /pravinadmin (NO LOGIN REQUIRED)
   ========================================================================== */
app.get('/pravinadmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve frontend for all other routes
app.use((req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`
  🏛️  ======================================================
  🏛️  K ARCH ARCHITECTS FULLSTACK SERVER RUNNING
  🏛️  Port: http://localhost:${PORT}
  🏛️  Admin Panel: http://localhost:${PORT}/pravinadmin
  🏛️  ======================================================
  `);
});
