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
import { ClientWorkModel } from './models/ClientWork';

dotenv.config();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[DATABASE] Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('[DATABASE] Connection Error:', err);
    });
}

// Configure Cloudinary
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn('[SYSTEM] Cloudinary is not configured. Image/Video uploads will use memory storage (ephemeral).');
}

const imageStorage = isCloudinaryConfigured 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'portfolio/images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      } as any,
    }) 
  : multer.memoryStorage();

const videoStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'portfolio/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      } as any,
    })
  : multer.memoryStorage();

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(compression());

// Request logging and cache control middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// API Routes
// Real-time Event Clients
let clients: express.Response[] = [];

// SSE Endpoint
app.get('/api/admin/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx
  res.flushHeaders();

  // Send initial message
  res.write('data: {"type":"CONNECTED","timestamp":' + Date.now() + '}\n\n');

  clients.push(res);
  console.log(`[SSE] Client connected. Total: ${clients.length}`);

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients = clients.filter(c => c !== res);
    console.log(`[SSE] Client disconnected. Total: ${clients.length}`);
  });
});

function broadcastEvent(type: string, data?: any) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: Date.now() })}\n\n`;
  clients.forEach(client => client.write(payload));
}

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    storage: isCloudinaryConfigured ? 'cloudinary' : 'memory'
  });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'System configuration error: ADMIN_PASSWORD missing' });
  }
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ error: 'System Access Denied' });
  }
});

app.post('/api/admin/projects', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    const project = new ProjectModel(req.body);
    await project.save();
    broadcastEvent('PROJECT_ADDED', project);
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save project', details: error.message });
  }
});

app.put('/api/admin/projects/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    const project = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    broadcastEvent('PROJECT_UPDATED', project);
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
});

app.delete('/api/admin/projects/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    await ProjectModel.findByIdAndDelete(req.params.id);
    broadcastEvent('PROJECT_DELETED', { id: req.params.id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
});

app.post('/api/admin/certifications', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    const cert = new CertificationModel(req.body);
    await cert.save();
    broadcastEvent('CERT_ADDED', cert);
    res.json({ success: true, cert });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save certification', details: error.message });
  }
});

app.delete('/api/admin/certifications/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    await CertificationModel.findByIdAndDelete(req.params.id);
    broadcastEvent('CERT_DELETED', { id: req.params.id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete certification', details: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DATABASE] Not connected, returning empty projects');
      return res.json([]);
    }
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/admin/upload', uploadImage.single('file'), (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    if (!isCloudinaryConfigured) {
      // Memory storage fallback - real path doesn't exist, we'd need to upload elsewhere
      // For now, we return a warning or local path if we had one.
      // But in this specific environment, we should probably just error out or warn.
      return res.status(400).json({ 
        error: 'Cloudinary not configured', 
        details: 'Server is using memory storage. Direct file access is not available.' 
      });
    }
    
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/admin/upload-video', uploadVideo.single('file'), (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    if (!isCloudinaryConfigured) {
      return res.status(400).json({ 
        error: 'Cloudinary not configured', 
        details: 'Server is using memory storage. Direct file access is not available.' 
      });
    }

    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Video upload failed' });
  }
});

app.get('/api/certifications', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DATABASE] Not connected, returning empty certifications');
      return res.json([]);
    }
    const certs = await CertificationModel.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// Client Work Routes
app.get('/api/client-work', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DATABASE] Not connected, returning empty client work');
      return res.json([]);
    }
    const works = await ClientWorkModel.find().sort({ createdAt: -1 });
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client work' });
  }
});

app.post('/api/admin/client-work', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    const work = new ClientWorkModel(req.body);
    await work.save();
    broadcastEvent('CLIENT_WORK_ADDED', work);
    res.json({ success: true, work });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save client work', details: error.message });
  }
});

app.delete('/api/admin/client-work/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected');
    await ClientWorkModel.findByIdAndDelete(req.params.id);
    broadcastEvent('CLIENT_WORK_DELETED', { id: req.params.id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete client work', details: error.message });
  }
});

app.get('/api/github/repos/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Alex-Portfolio-Server'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'GitHub user not found' });
      }
      throw new Error(`GitHub API responded with ${response.status}`);
    }
    
    const repos = await response.json();
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      topics: repo.topics || []
    }));
    
    res.json(formattedRepos);
  } catch (error: any) {
    console.error('[GITHUB] Error fetching repos:', error.message);
    // Fallback to mock data if API fails (rate limits etc)
    res.json([
      { id: 1, name: 'SmartRent (Local Cache)', html_url: 'https://github.com/AlexObwogi/SmartRent', description: 'AI PropTech' },
      { id: 2, name: 'SentinelCloud (Local Cache)', html_url: 'https://github.com/AlexObwogi/SentinelCloud', description: 'AWS Security' }
    ]);
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.json({
        projectCount: 0,
        securityLabs: 10,
        techModules: [],
        systemState: 'Database_Offline'
      });
    }
    const projectCount = await ProjectModel.countDocuments();
    const allProjects = await ProjectModel.find();
    const techStackSet = new Set<string>();
    allProjects.forEach(p => {
      p.techStack?.forEach((tech: string) => techStackSet.add(tech));
      p.languages?.forEach((lang: string) => techStackSet.add(lang));
    });
    res.json({
      projectCount: projectCount,
      securityLabs: projectCount > 5 ? projectCount + 2 : 10,
      techModules: Array.from(techStackSet),
      systemState: 'Operational'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 404 for API routes
app.use('/api', (req, res) => {
  console.warn(`[API] 404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Enhanced logging for diagnostics
  const errorDetails = {
    name: err.name || 'Error',
    message: err.message || 'Unknown error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    storageErrors: err.storageErrors || [],
    path: req.path,
    method: req.method
  };
  
  console.error('[SYSTEM] Unhandled Error:', JSON.stringify(errorDetails, null, 2));

  if (req.path.startsWith('/api')) {
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message || 'An unexpected error occurred',
      type: err.name
    });
  } else {
    next(err);
  }
});

// Vite Setup for Development
let vitePromise: Promise<any> | null = null;
if (process.env.NODE_ENV !== 'production') {
  vitePromise = createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then(vite => {
    app.use(vite.middlewares);
    return vite;
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export { app, vitePromise };
