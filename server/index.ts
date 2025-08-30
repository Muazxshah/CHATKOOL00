import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Enhanced CORS configuration for custom domains
app.use(cors({
  origin: function (origin: string | undefined, callback: (error: Error | null, success?: boolean) => void) {
    // Allow all origins for development and deployment
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5000', 
      'https://chatkool.net',
      'http://chatkool.net',
      /\.replit\.app$/,
      /\.replit\.dev$/
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      return allowed.test(origin);
    });
    
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Reduced logging to save resources
app.use((req, res, next) => {
  // Only log errors and important API calls
  if (req.path.startsWith("/api") && req.method !== "GET") {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (res.statusCode >= 400) {
        log(`ERROR: ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      }
    });
  }
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Log port configuration for debugging
  console.log('Environment PORT:', process.env.PORT);
  console.log('Using port:', port);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
