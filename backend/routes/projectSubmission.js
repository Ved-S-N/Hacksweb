import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/submissions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|zip|ppt|pptx|doc|docx|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Create new project submission
router.post('/create', async (req, res) => {
  try {
    const {
      projectName,
      description,
      longDescription,
      githubUrl,
      demoUrl,
      videoUrl,
      track,
      technologies,
      teamMembers,
      eventId,
      teamId,
      userId
    } = req.body;

    const submission = await prisma.submission.create({
      data: {
        title: projectName,
        description,
        longDescription,
        githubLink: githubUrl,
        demoUrl,
        videoUrl,
        track,
        technologies,
        teamMembers,
        eventId: parseInt(eventId),
        teamId: parseInt(teamId),
        userId: parseInt(userId),
        status: 'draft',
        submittedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Project submission created successfully'
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create submission',
      error: error.message
    });
  }
});

// Upload files for submission
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files;
    const urls = files.map(file => `/uploads/submissions/${file.filename}`);

    res.json({
      success: true,
      urls: urls
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      error: error.message
    });
  }
});

// Complete submission
router.post('/complete', async (req, res) => {
  try {
    const {
      projectName,
      description,
      githubLink,
      demoUrl,
      videoUrl,
      liveSubmissionUrl,
      teamMembers,
      technologies,
      features,
      challenges,
      futureScope,
      screenshots,
      presentation,
      codeFiles,
      reportFile,
      eventId,
      teamId,
      userId
    } = req.body;

    const submission = await prisma.submission.create({
      data: {
        title: projectName,
        description,
        githubLink,
        demoUrl,
        videoUrl,
        liveSubmissionUrl,
        teamMembers,
        technologies,
        features,
        challenges,
        futureScope,
        screenshots,
        presentation,
        codeFiles,
        reportFile,
        eventId: parseInt(eventId),
        teamId: parseInt(teamId),
        userId: parseInt(userId),
        status: 'submitted',
        submittedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Submission completed successfully'
    });
  } catch (error) {
    console.error('Error completing submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete submission',
      error: error.message
    });
  }
});

// Get submission by user and event
router.get('/user/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id; // Assuming user ID is populated by authentication middleware

    const submission = await prisma.submission.findFirst({
      where: {
        eventId: parseInt(eventId),
        userId: userId
      },
      include: {
        event: true,
        team: {
          include: {
            members: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
});

// Get all submissions for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const submissions = await prisma.submission.findMany({
      where: {
        eventId: parseInt(eventId)
      },
      include: {
        team: {
          include: {
            members: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
});

// Update submission status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await prisma.submission.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status
      }
    });

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission status',
      error: error.message
    });
  }
});

export default router;
