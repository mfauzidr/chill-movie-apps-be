import express from "express";
import healthRouter from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use("/api/v1/health", healthRouter);

export default app;
