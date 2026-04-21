# Alex's Professional Portfolio & AI Assistant

A high-performance, full-stack portfolio for a **Software Engineer & Cloud Security Specialist**. This project features a unified white-on-black aesthetic, an AI digital twin ("Alex") powered by Gemini Pro, and a secure admin command center.

## 🚀 Live Deployment (Render & GitHub)

This project is optimized for deployment on **Render** via GitHub integration.

### 1. Prerequisites
- A [GitHub](https://github.com) account.
- A [Render](https://render.com) account.
- A **Google AI Studio API Key** (Get it at [aistudio.google.com](https://aistudio.google.com/app/apikey)).
- A **MongoDB Atlas** connection string (for persistence, optional if using mock data).

### 2. Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your secrets.
4. Run in development mode:
   ```bash
   npm run dev
   ```

### 3. Deploying to Render
1. Push your code to a private GitHub repository.
2. Log in to Render and create a **New Web Service**.
3. Connect your GitHub repository.
4. Render will detect the `render.yaml` or use the following settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. **CRITICAL:** Add the following Environment Variables in the Render Dashboard:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: (Your Google API Key)
   - `ADMIN_PASSWORD`: (Your chosen admin password)
   - `JWT_SECRET`: (Any random string for security)
   - `MONGODB_URI`: (Your Database URI)

## 🛠️ Features
- **AI Digital Twin:** Conversational assistant powered by Gemini 1.5 Flash.
- **Secure Terminal:** Admin panel protected by server-side password validation.
- **Project Scape:** Automated project deployment simulation and management.
- **High-Fidelity UI:** Framer Motion (motion) animations with a premium dark theme.

## 🔒 Security Note
This project uses server-side environment variables to protect API keys. **Never commit your `.env` file to GitHub.** The `.env.example` file is provided as a template.
