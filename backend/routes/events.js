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

const router = express.Router();
const prisma = new PrismaClient();

// Create an event (with improved error handling)
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
      participants,
      maxParticipants,
      status,
      tags,
      rules,
      banner,
      organizerId,
      tracks,
      timeline,
      sponsors,
    } = req.body;
    const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrize: totalPrize || 0,

        tracks: {
          create: (Array.isArray(tracks) ? tracks : []).map((track) => ({
            name: track.name, // directly the string
          })),
        },

        timeline: {
          create: (Array.isArray(timeline) ? timeline : []).map((item) => ({
            phase: item.phase,
            date: new Date(item.date),
          })),
        },

        sponsors: {
          create: (sponsors || []).map((sponsor) => ({
            name: sponsor.name,
          })),
        },
      },
      include: {
        tracks: true,
        timeline: true,
        sponsors: true,
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { teams: true, submissions: true, judges: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
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
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

export default router;
