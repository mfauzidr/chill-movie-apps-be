import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Chill Movie Apps API is running",
  });
});

export default healthRouter;
