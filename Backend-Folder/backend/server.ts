import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Route handlers - imported from ../server/routes
import institutionsRouter from '../server/routes/institutions';
import inspectionsRouter from '../server/routes/inspections';
import alertsRouter from '../server/routes/alerts';
import analyticsRouter from '../server/routes/analytics';
import telemetryRouter from '../server/routes/telemetry';
import auditRouter from '../server/routes/audit';
import aiRouter from '../server/routes/ai';

export async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Nirikshan AI - Ground Reality Monitoring Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  app.use('/api/institutions', institutionsRouter);
  app.use('/api/inspections', inspectionsRouter);
  app.use('/api/alerts', alertsRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/telemetry', telemetryRouter);
  app.use('/api/audit-trail', auditRouter);
  app.use('/api/ai', aiRouter);

  // Vite middleware for development vs static build for production
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
    console.log(`[Nirikshan AI Backend] Running on http://0.0.0.0:${PORT}`);
  });

  return app;
}

startServer();
