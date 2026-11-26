import express, { Request, Response } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import router from "./shared/routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const corsConfig: CorsOptions = {
  origin: [
    "http://localhost:8888",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://localhost:8080",
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Authorization", "x-headers", "Content-Type"],
};
app.use(cors(corsConfig));

app.use(express.static("./public"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Backend is running well 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(router);

export default app;
