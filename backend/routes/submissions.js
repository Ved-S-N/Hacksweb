import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create submission
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      githubLink,
      videoLink,
      files,
      teamId,
      eventId,
      userId,
    } = req.body;
    const submission = await prisma.submission.create({
      data: {
        title,
        description,
        githubLink,
        videoLink,
        files,
        teamId,
        eventId,
        userId,
      },
    });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all submissions
router.get("/", async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: { scores: true, user: true, team: true },
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update submission
router.put("/:id", async (req, res) => {
  try {
    const { title, description, githubLink, videoLink, files } = req.body;
    const updatedSubmission = await prisma.submission.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, githubLink, videoLink, files },
    });
    res.json(updatedSubmission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete submission
router.delete("/:id", async (req, res) => {
  try {
    await prisma.submission.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
