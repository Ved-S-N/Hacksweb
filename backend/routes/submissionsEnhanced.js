import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import * as azureStorage from "../services/azureStorage.js";
import SubmissionMetadata from "../models/SubmissionMetadata.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Create new submission
router.post(
  "/",
  authenticateToken,
  upload.array("files", 5),
  async (req, res) => {
    try {
      const {
        title,
        description,
        githubLink,
        videoLink,
        teamId,
        eventId,
        submissionType,
        roundId,
      } = req.body;

      // Validate required fields
      if (!title || !description || !teamId || !eventId || !submissionType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if event is live and accepting submissions
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
        include: { rounds: true },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (!event.isLive && submissionType === "live_submission") {
        return res
          .status(400)
          .json({ error: "Event is not live for submissions" });
      }

      // Upload files to Azure Blob Storage
      const uploadedFiles = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await azureStorage.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype
          );
          uploadedFiles.push(result);
        }
      }

      // Create submission in SQL database
      const submission = await prisma.submission.create({
        data: {
          title,
          description,
          githubLink,
          videoLink,
          files: JSON.stringify(
            uploadedFiles.map((f) => ({
              filename: f.blobName,
              url: f.url,
              size: f.size,
            }))
          ),
          teamId: parseInt(teamId),
          eventId: parseInt(eventId),
          userId: req.user.id,
          status: "submitted",
          submittedAt: new Date(),
        },
      });

      // Create metadata in MongoDB
      const metadata = new SubmissionMetadata({
        submissionId: submission.id,
        eventId: parseInt(eventId),
        teamId: parseInt(teamId),
        userId: req.user.id,
        title,
        description,
        submissionType,
        files: uploadedFiles.map((f) => ({
          filename: f.blobName,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
          blobUrl: f.url,
        })),
        githubRepo: githubLink ? { url: githubLink } : undefined,
        video: videoLink ? { url: videoLink } : undefined,
        rounds: roundId
          ? [
              {
                roundId: parseInt(roundId),
                status: "submitted",
                submittedAt: new Date(),
              },
            ]
          : [],
      });

      await metadata.save();

      res.status(201).json({
        submission,
        files: uploadedFiles,
        metadata: metadata._id,
      });
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get submissions for an event with round filtering
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { roundId, teamId, status } = req.query;

    const whereClause = {
      eventId: parseInt(eventId),
    };

    if (roundId) {
      whereClause.rounds = {
        some: {
          roundId: parseInt(roundId),
        },
      };
    }

    if (teamId) {
      whereClause.teamId = parseInt(teamId);
    }

    if (status) {
      whereClause.status = status;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        team: {
          include: {
            members: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        scores: {
          include: {
            judge: {
              include: {
                user: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get metadata from MongoDB
    const metadataMap = {};
    const metadata = await SubmissionMetadata.find({
      submissionId: { $in: submissions.map((s) => s.id) },
    });

    metadata.forEach((m) => {
      metadataMap[m.submissionId] = m;
    });

    const submissionsWithMetadata = submissions.map((sub) => ({
      ...sub,
      metadata: metadataMap[sub.id] || null,
    }));

    res.json(submissionsWithMetadata);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Submit for a specific round
router.post(
  "/:submissionId/round/:roundId/submit",
  authenticateToken,
  async (req, res) => {
    try {
      const { submissionId, roundId } = req.params;
      const { feedback } = req.body;

      const submission = await prisma.submission.findUnique({
        where: { id: parseInt(submissionId) },
        include: { event: true },
      });

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      // Check if event is live
      if (!submission.event.isLive) {
        return res
          .status(400)
          .json({ error: "Event is not live for submissions" });
      }

      // Update submission round status
      await prisma.submissionRound.upsert({
        where: {
          submissionId_roundId: {
            submissionId: parseInt(submissionId),
            roundId: parseInt(roundId),
          },
        },
        update: {
          status: "submitted",
          submittedAt: new Date(),
          feedback,
        },
        create: {
          submissionId: parseInt(submissionId),
          roundId: parseInt(roundId),
          status: "submitted",
          submittedAt: new Date(),
          feedback,
        },
      });

      // Update MongoDB metadata
      await SubmissionMetadata.findOneAndUpdate(
        { submissionId: parseInt(submissionId) },
        {
          $set: {
            "rounds.$[round].status": "submitted",
            "rounds.$[round].submittedAt": new Date(),
          },
        },
        {
          arrayFilters: [{ "round.roundId": parseInt(roundId) }],
          new: true,
        }
      );

      res.json({ message: "Successfully submitted for round" });
    } catch (error) {
      console.error("Error submitting for round:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get live event submissions
router.get("/live/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event || !event.isLive) {
      return res.status(400).json({ error: "Event is not live" });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        eventId: parseInt(eventId),
        status: "submitted",
        submittedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        team: {
          include: {
            members: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching live submissions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update submission status
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    const submission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: {
        status,
        ...(feedback && { description: feedback }),
      },
    });

    res.json(submission);
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete submission
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get submission to delete files
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(id) },
    });

    if (submission.files) {
      const files = JSON.parse(submission.files);
      for (const file of files) {
        await azureStorage.deleteFile(file.filename);
      }
    }

    // Delete from MongoDB
    await SubmissionMetadata.deleteOne({ submissionId: parseInt(id) });

    // Delete from SQL
    await prisma.submission.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
