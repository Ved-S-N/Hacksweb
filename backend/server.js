import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";

import chatRoutes from "./routes/chat.js";
import announcementRoutes from "./routes/announcements.js";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import submissionRoutes from "./routes/submissions.js";
import submissionEnhancedRoutes from "./routes/submissionsEnhanced.js";
import judgingRoutes from "./routes/judging.js";
import teamRoutes from "./routes/team.js";
import organizerRoutes from "./routes/organizers.js";
import authRoutes from "./routes/auth.js";
import projectSubmissionRoutes from "./routes/projectSubmission.js";

dotenv.config();

const app = express();
const PORT = 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

app.use("/api/chats", chatRoutes);
app.use("/api/announcements", announcementRoutes);

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/submissions-enhanced", submissionEnhancedRoutes);
app.use("/api/judging", judgingRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project-submissions", projectSubmissionRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectMongoDB();

  try {
    await prisma.$connect();
    console.log("Connected to Azure SQL via Prisma!");
  } catch (err) {
    console.error("Prisma connection error:", err);
  }
});
