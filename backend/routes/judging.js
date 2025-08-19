import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create score
router.post("/", async (req, res) => {
  try {
    const { submissionId, judgeId, round, score, feedback } = req.body;
    const newScore = await prisma.score.create({
      data: { submissionId, judgeId, round, score, feedback },
    });
    res.json(newScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get scores for a submission
router.get("/submission/:id", async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      where: { submissionId: parseInt(req.params.id) },
      include: { judge: true },
    });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
