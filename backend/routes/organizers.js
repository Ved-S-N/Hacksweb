import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create an organizer
router.post("/", async (req, res) => {
  try {
    const { name, avatar, description, website } = req.body;

    const organizer = await prisma.organizer.create({
      data: {
        name,
        avatar: avatar || null,
        description: description || null,
        website: website || null,
      },
    });

    res.json(organizer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all organizers
router.get("/", async (_req, res) => {
  try {
    const organizers = await prisma.organizer.findMany();
    res.json(organizers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
