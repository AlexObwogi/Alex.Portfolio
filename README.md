# Alex Obwogi | Quantitative Software Engineering Portfolio

A high-performance, full-stack portfolio and professional management system built for high-scale data visualization and quantitative analysis demonstration.

## 🚀 Architecture

The system is architected as a decoupled Fullstack application:
- **Frontend**: React 19 + Vite + Tailwind CSS 4.0. Utilizing Framer Motion for cinematic UI transitions and Three.js for interactive data visualization.
- **Backend**: Node.js + Express. Highly optimized API routes with Server-Sent Events (SSE) for real-time data synchronization.
- **Database**: MongoDB (Mongoose) for structured data and Cloudinary for high-performance asset delivery.

## 🛠 Tech Stack

- **Core**: React, TypeScript, Node.js, Express
- **Visuals**: Three.js, Framer Motion, Tailwind CSS
- **Data**: MongoDB, Recharts, D3.js
- **Services**: Cloudinary API, Generative AI Engine (Content Tailoring), SSE Real-time Updates

## 📋 Features

- **Dynamic Resume Engine**: Real-time tailoring of professional narratives using advanced LLM integration.
- **Client Work Ledger**: Detailed repository of freelance and contract systems delivery.
- **Project Lab**: Comprehensive showcase of engineering projects with technical briefs and AI-driven analysis.
- **Admin Command Center**: Secure control panel for real-time content management and site performance monitoring.
- **Interactive Skill Graph**: 3D visualization of technical expertise and system interconnectivity.

## 🔧 Installation & Deployment

### Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_ai_engine_key
JWT_SECRET=your_secure_random_string
```

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🔒 Security
- **JWT Authentication**: Secure admin access via JSON Web Tokens.
- **CSP & CORS**: Hardened headers and cross-origin resource sharing policies.
- **Data Integrity**: Real-time sync via SSE to ensure UI consistency across multiple sessions.

---
*Professional Portfolio | Engineered by Alex Obwogi*
