import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import compression from 'compression';
import { ProjectModel } from './models/Project';
import { CertificationModel } from './models/Certification';

dotenv.config();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[DATABASE] Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('[DATABASE] Connection Error:', err);
      // Don't crash the server, just log the error
    });
} else {
  console.warn('[DATABASE] MONGODB_URI not found. Server running in limited data mode.');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Multer Storage for Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

// Setup Multer Storage for Videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  } as any,
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(compression());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Admin login simulation (for JWT)
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      // In a real app, use jsonwebtoken here
      res.json({ token: 'mock-jwt-token' });
    } else {
      res.status(401).json({ error: 'System Access Denied' });
    }
  });

  // Admin project creation endpoint
  app.post('/api/admin/projects', async (req, res) => {
    try {
      const project = new ProjectModel(req.body);
      await project.save();
      res.json({ success: true, project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save project' });
    }
  });

  // Admin project update endpoint
  app.put('/api/admin/projects/:id', async (req, res) => {
    try {
      const project = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  // Admin project delete endpoint
  app.delete('/api/admin/projects/:id', async (req, res) => {
    try {
      await ProjectModel.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Get all projects
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await ProjectModel.find().sort({ createdAt: -1 });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Admin upload endpoint
  app.post('/api/admin/upload', uploadImage.single('file'), (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      res.json({ url: req.file.path });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Admin video upload endpoint
  app.post('/api/admin/upload-video', uploadVideo.single('file'), (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video uploaded' });
      }
      res.json({ url: req.file.path });
    } catch (error) {
      console.error('Video Upload Error:', error);
      res.status(500).json({ error: 'Video upload failed' });
    }
  });

  // Certification Routes
  app.post('/api/admin/certifications', async (req, res) => {
    try {
      const cert = new CertificationModel(req.body);
      await cert.save();
      res.json({ success: true, cert });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save certification' });
    }
  });

  app.delete('/api/admin/certifications/:id', async (req, res) => {
    try {
      await CertificationModel.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete certification' });
    }
  });

  app.get('/api/certifications', async (req, res) => {
    try {
      const certs = await CertificationModel.find().sort({ createdAt: -1 });
      res.json(certs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch certifications' });
    }
  });

  // Dynamic Statistics Endpoint
  app.get('/api/stats', async (req, res) => {
    try {
      const projectCount = await ProjectModel.countDocuments();
      const allProjects = await ProjectModel.find();
      
      const techStackSet = new Set<string>();
      allProjects.forEach(p => {
        p.techStack?.forEach((tech: string) => techStackSet.add(tech));
        p.languages?.forEach((lang: string) => techStackSet.add(lang));
      });

      res.json({
        projectCount: projectCount,
        securityLabs: projectCount > 5 ? projectCount + 2 : 10, // Simulated but linked
        techModules: Array.from(techStackSet),
        systemState: 'Operational'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // GitHub Repositories Endpoint
  app.get('/api/github/repos/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (!response.ok) throw new Error('GitHub API failed');
      const repos = await response.json();
      res.json(repos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch GitHub repos' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM] Initialized: Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
