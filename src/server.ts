import express from "express";
import connectDB from "./config/db";
import AuthRoutes from "./routes/authRoutes";
import cors from "cors";
import { corsConfig } from "./config/cors";

connectDB();

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.use('/api/auth', AuthRoutes);

export default app;