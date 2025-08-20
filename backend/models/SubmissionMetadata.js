// submissionMetadata.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  blobUrl: String,
  sasUrl: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: String,
  isProcessed: { type: Boolean, default: false },
});

const submissionMetadataSchema = new mongoose.Schema({
  submissionId: { type: Number, required: true, unique: true },
  eventId: { type: Number, required: true },
  teamId: { type: Number, required: true },
  userId: { type: Number, required: true },
  title: String,
  description: String,
  submissionType: {
    type: String,
    enum: ["document", "github_repo", "video", "other"],
    required: true,
  },
  files: [fileSchema],
  githubRepo: {
    url: String,
    branch: String,
    commitHash: String,
    isArchived: { type: Boolean, default: false },
  },
  video: {
    url: String,
    duration: Number,
    thumbnail: String,
  },
  metadata: {
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    processingStartedAt: Date,
    processingCompletedAt: Date,
    errorMessage: String,
  },
  rounds: [
    {
      roundId: Number,
      roundNumber: Number,
      status: {
        type: String,
        enum: ["pending", "submitted", "reviewed", "scored"],
        default: "pending",
      },
      submittedAt: Date,
      reviewedAt: Date,
      score: Number,
      feedback: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

submissionMetadataSchema.index({ submissionId: 1 });
submissionMetadataSchema.index({ eventId: 1 });
submissionMetadataSchema.index({ teamId: 1 });

// Use existing model if it exists, otherwise create a new one
const SubmissionMetadata =
  mongoose.models.SubmissionMetadata ||
  mongoose.model("SubmissionMetadata", submissionMetadataSchema);

export default SubmissionMetadata;
