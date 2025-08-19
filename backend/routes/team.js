import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create a team
router.post("/", async (req, res) => {
  try {
    const { name, eventId, memberIds } = req.body;

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(400).json({ error: "Event does not exist" });

    // Create the team and connect members
    const team = await prisma.team.create({
      data: {
        name,
        eventId,
        members: {
          connect: memberIds.map((id) => ({ id })),
        },
      },
      include: { members: true },
    });

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all teams
router.get("/", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: { members: true, submissions: true, event: true },
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single team
router.get("/:id", async (req, res) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { members: true, submissions: true, event: true },
    });
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add members to a team (increase team size)
router.patch("/:id/add-members", async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const { memberIds } = req.body; // array of user IDs

    // Check team exists
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Add new members
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: memberIds.map((id) => ({ id })),
        },
      },
      include: { members: true },
    });

    res.json(updatedTeam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a team
router.delete("/:id", async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);

    // Check team exists
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(404).json({ error: "Team not found" });

    await prisma.team.delete({ where: { id: teamId } });
    res.json({ message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
