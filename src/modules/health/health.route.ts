import { Router } from "express";

const healthRoute: Router = Router();

healthRoute.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

export { healthRoute };
