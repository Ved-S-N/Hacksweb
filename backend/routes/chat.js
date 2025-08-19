import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

// POST: add a new message
router.post("/", async (req, res) => {
  try {
    const { eventId, userId, message } = req.body;
    const newChat = await Chat.create({ eventId, userId, message });
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: get all messages for an event
router.get("/:eventId", async (req, res) => {
  try {
    const chats = await Chat.find({ eventId: req.params.eventId })
      .populate("userId", "name email")
      .sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
