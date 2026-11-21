const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy to dist
const filesToCopy = [
  'index.html',
  'team-pravin-khade.html',
  'team-prajakta-khade.html',
  'README.md'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`Copied ${file} -> dist/`);
  }
});

// Copy assets folder
const assetsDir = path.join(__dirname, 'assets');
if (fs.existsSync(assetsDir)) {
  copyFolderSync(assetsDir, path.join(distDir, 'assets'));
  console.log('Copied assets/ -> dist/assets/');
}

// Create _redirects for Render static site clean routing
const redirectsContent = `/*    /index.html   200\n`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
console.log('Created dist/_redirects for Render deployment');

console.log('✅ Build completed successfully! Distribution files ready in dist/');
