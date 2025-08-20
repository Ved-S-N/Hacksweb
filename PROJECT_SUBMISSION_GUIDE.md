# Enhanced Project Submission System

## Overview
This system provides a comprehensive project submission portal for hackathons with multi-step forms, file uploads, and progress tracking.

## Features
- **Multi-step submission form** with progress tracking
- **File upload support** for screenshots, presentations, code files, and reports
- **Team management** with member roles
- **Technology and feature tagging**
- **Real-time progress indicator**
- **Responsive design** with dark mode support

## New Files Created

### Backend
- `Hacksweb/backend/routes/projectSubmission.js` - Complete submission API with file upload support

### Frontend
- `Hacksweb/frontend/src/pages/EnhancedProjectSubmission.tsx` - Main submission form
- `Hacksweb/frontend/src/pages/SubmissionSuccess.tsx` - Success page after submission

## API Endpoints

### Project Submissions
- `POST /api/project-submissions/create` - Create new submission
- `POST /api/project-submissions/upload` - Upload files
- `POST /api/project-submissions/complete` - Complete submission
- `GET /api/project-submissions/user/:eventId` - Get user submission
- `GET /api/project-submissions/event/:eventId` - Get all submissions
- `PATCH /api/project-submissions/:id/status` - Update submission status

## Usage
1. Navigate to `/events/:eventId/submit` to access the submission form
2. Fill in project details across 5 tabs:
   - Basic Info (required)
   - Project Details
   - Team & Tech
   - Files & Assets
   - Review & Submit
3. Upload required files
4. Submit when all required fields are complete

## File Upload Support
- Screenshots: Images (jpg, png, gif)
- Presentations: PDF, PPT, PPTX
- Code Files: ZIP, JS, PY, JAVA, CPP, C, HTML, CSS, JSON
- Reports: PDF only

## Setup Instructions
1. Install required dependencies:
   ```bash
   npm install multer
   ```
2. Ensure upload directories exist:
   ```bash
   mkdir -p backend/uploads/submissions
   ```
3. Update server.js to include the new routes
4. Restart the backend server
