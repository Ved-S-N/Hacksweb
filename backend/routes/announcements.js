import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// POST: add an announcement
router.post("/", async (req, res) => {
  try {
    const { eventId, title, content, postedBy } = req.body;
    const newAnn = await Announcement.create({
      eventId,
      title,
      content,
      postedBy,
    });
    res.status(201).json(newAnn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: all announcements for an event
router.get("/:eventId", async (req, res) => {
  try {
    const anns = await Announcement.find({ eventId: req.params.eventId })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(anns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
