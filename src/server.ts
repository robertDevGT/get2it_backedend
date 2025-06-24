import express from "express";
import connectDB from "./config/db";
import AuthRoutes from "./routes/authRoutes";

connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', AuthRoutes);

export default app;