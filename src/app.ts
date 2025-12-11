import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { mainRouter } from "./routers";
import { auth } from "./lib/auth";
import dotenv from "dotenv";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
dotenv.config();

app.use("/api", mainRouter);

export default app;
