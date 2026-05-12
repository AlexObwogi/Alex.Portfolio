import { app, vitePromise } from './app';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  // Wait for Vite to be ready in development
  if (vitePromise) {
    console.log('[SYSTEM] Waiting for Vite middleware...');
    try {
      await vitePromise;
      console.log('[SYSTEM] Vite middleware initialized');
    } catch (err) {
      console.error('[SYSTEM] Vite initialization failed:', err);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM] Initialized: Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[SYSTEM] Failed to start server:', err);
  process.exit(1);
});
