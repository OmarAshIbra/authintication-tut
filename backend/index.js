import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/ConnectDB.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Cookie Parser
app.use(cookieParser());

// Database connection

app.use("/api/auth", authRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

//
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
