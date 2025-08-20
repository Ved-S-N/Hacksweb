// Create Dummy Submission Script
// This script will create a dummy submission that appears in your submissions page

const fetch = require('node-fetch');

// Configuration - Update these values based on your actual data
const CONFIG = {
  // Replace with your actual user ID
  userId: 1,
  // Replace with your actual team ID
  teamId: 1,
  // Replace with your actual event ID
  eventId: 1,
  // API base URL - adjust if needed
  apiUrl: 'http://localhost:3000/api'
};

// Dummy submission data
const dummySubmission = {
  projectName: "My Awesome Project - Dummy Submission",
  description: "This is a dummy submission created to show up on the submissions page. All data is placeholder content.",
  longDescription: "This project demonstrates innovative solutions to common problems. It includes cutting-edge technologies and showcases best practices in software development. This is a dummy submission created for testing purposes.",
  githubUrl: "https://github.com/example/dummy-project",
  demoUrl: "https://dummy-project-demo.netlify.app",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  track: "Web Development",
  technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  teamMembers: [
    {
      id: "1",
      name: "Team Member 1",
      email: "member1@example.com",
      role: "Frontend Developer"
    },
    {
      id: "2", 
      name: "Team Member 2",
      email: "member2@example.com",
      role: "Backend Developer"
    }
  ],
  features: [
    "User authentication and authorization",
    "Real-time collaboration",
    "Responsive design",
    "API integration",
    "Data visualization"
  ],
  challenges: "Learning new technologies and integrating different services",
  futureScope: "Adding AI-powered features and mobile app support"
};

async function createDummySubmission() {
  try {
    console.log('Creating dummy submission...');
    
    // Create the submission
    const response = await fetch(`${CONFIG.apiUrl}/project-submissions/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...dummySubmission,
        eventId: CONFIG.eventId,
        teamId: CONFIG.teamId,
        userId: CONFIG.userId
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Dummy submission created successfully!');
      console.log('Submission ID:', result.data.id);
      console.log('Title:', result.data.title);
      console.log('Status:', result.data.status);
      console.log('Submitted at:', result.data.submittedAt);
      
      console.log('\n📋 Your dummy submission will now appear on:');
      console.log('- Your submissions page');
      console.log('- Event submissions list');
      console.log('- Read-only view at /submission/' + result.data.id);
      
    } else {
      console.error('❌ Failed to create dummy submission:', response.statusText);
      const error = await response.json();
      console.error('Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Error creating dummy submission:', error);
  }
}

// Run the script
createDummySubmission();
