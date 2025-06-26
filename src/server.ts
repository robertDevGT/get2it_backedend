import { corsConfig } from "./config/cors";
import express from "express";
import connectDB from "./config/db";
import AuthRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import noteRoutes from "./routes/noteRoutes";
import cors from "cors";
import path from "path";

connectDB();

const app = express();

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(cors(corsConfig));
app.use(express.json());

app.use('/api/auth', AuthRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);

export default app;