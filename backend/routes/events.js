// import express from "express";
// import { PrismaClient } from "@prisma/client";

// const router = express.Router();
// const prisma = new PrismaClient();

// // Create an event (simpler version storing tracks, timeline, sponsors as JSON)
// router.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       longDescription,
//       startDate,
//       endDate,
//       location,
//       isOnline,
//       totalPrize,
//       participants,
//       maxParticipants,
//       status,
//       tags,
//       rules,
//       banner,
//       organizerId,
//       tracks,
//       timeline,
//       sponsors,
//     } = req.body;

//     const event = await prisma.event.create({
//       data: {
//         title,
//         description,
//         longDescription: longDescription || null,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         location: location || null,
//         isOnline: isOnline || false,
//         totalPrize: totalPrize || 0,
//         participants: participants || 0,
//         maxParticipants: maxParticipants || 0,
//         status: status || "Draft",
//         tags: JSON.stringify(tags || []),
//         rules: JSON.stringify(rules || []),
//         banner: banner || null,
//         organizerId,
//         tracks: JSON.stringify(tracks || []),
//         timeline: JSON.stringify(timeline || []),
//         sponsors: JSON.stringify(sponsors || []),
//       },
//     });

//     res.status(201).json(event);
//   } catch (err) {
//     console.error("Error creating event:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all events
// router.get("/", async (req, res) => {
//   try {
//     const events = await prisma.event.findMany({
//       include: { teams: true, submissions: true, judges: true },
//     });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get single event
// router.get("/:id", async (req, res) => {
//   try {
//     const event = await prisma.event.findUnique({
//       where: { id: parseInt(req.params.id) },
//       include: { teams: true, submissions: true, judges: true },
//     });
//     res.json(event);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update event
// router.put("/:id", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const updatedEvent = await prisma.event.update({
//       where: { id: parseInt(req.params.id) },
//       data: { title, description },
//     });
//     res.json(updatedEvent);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete event
// router.delete("/:id", async (req, res) => {
//   try {
//     await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
//     res.json({ message: "Event deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js"; // ✅ ensure .js extension

const router = express.Router();
const prisma = new PrismaClient();

// Create an event
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      longDescription,
      startDate,
      endDate,
      location,
      isOnline,
      totalPrize,
      maxParticipants,
      participants,
      status,
      tags,
      rules,
      tracks,
      timeline,
      sponsors,
      organizerId,
      banner,
    } = req.body;

    // --- Normalize Tags ---
    const tagConnections = (tags || []).map((tag) => ({
      tag: {
        connectOrCreate: {
          where: { name: typeof tag === "string" ? tag : tag.name },
          create: { name: typeof tag === "string" ? tag : tag.name },
        },
      },
    }));

    // --- Normalize Rules ---
    const ruleConnections = (rules || []).map((rule) => ({
      rule: {
        connectOrCreate: {
          where: { text: typeof rule === "string" ? rule : rule.text },
          create: { text: typeof rule === "string" ? rule : rule.text },
        },
      },
    }));

    // --- Normalize Tracks ---
    const trackConnections = (tracks || [])
      .map((track) => {
        if (typeof track === "string") return { name: track.trim() };
        if (track?.name) return { name: track.name.trim() };
        return null;
      })
      .filter(Boolean);

    // --- Normalize Timeline ---
    const timelineConnections = (timeline || []).map((item) => {
      if (typeof item === "string") {
        const [phase, ...dateParts] = item.split("-");
        const dateString = dateParts.join("-");
        return {
          phase: phase?.trim() || "Phase",
          date: new Date(dateString.trim()),
        };
      }
      return { phase: item.phase?.trim(), date: new Date(item.date) };
    });

    // --- Normalize Sponsors ---
    const sponsorConnections = (sponsors || []).map((sponsor) => ({
      name: typeof sponsor === "string" ? sponsor : sponsor.name,
    }));

    // --- Create Event in Prisma ---
    const event = await prisma.event.create({
      data: {
        title,
        description,
        longDescription,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        isOnline: isOnline || false,
        totalPrize: totalPrize || 0,
        maxParticipants: maxParticipants || 100,
        participants: participants || 0,
        status: status || "upcoming",
        banner: banner || null,
        organizer: { connect: { id: organizerId } },
        eventTags: { create: tagConnections },
        eventRules: { create: ruleConnections },
        tracks: { create: trackConnections },
        timeline: { create: timelineConnections },
        sponsors: { create: sponsorConnections },
      },
      include: {
        tracks: true,
        timeline: true,
        sponsors: true,
        eventTags: { include: { tag: true } },
        eventRules: { include: { rule: true } },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { teams: true, submissions: true, judges: true },
    });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { teams: true, submissions: true, judges: true },
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description },
    });
    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Register for an event
router.post("/:id/register", authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { participants: { increment: 1 } },
    });

    res.json({ message: "Successfully registered", event: updatedEvent });
  } catch (err) {
    console.error("Error registering for event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get event registrations
router.get("/:id/registrations", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { participants: true },
    });

    res.json({ eventId, registeredCount: event?.participants || 0 });
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
