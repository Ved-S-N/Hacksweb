import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Home, Eye, Users, Code, Settings, FileText, Link, Github } from 'lucide-react';
import TeamTechDisplay from '@/components/TeamTechDisplay';

interface SubmissionData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  githubLink?: string;
  demoUrl?: string;
  videoUrl?: string;
  technologies: string[];
  features: string[];
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role?: string;
  }>;
  screenshots?: string[];
  presentation?: string[];
  submittedAt: string;
  status: string;
}

const ReadOnlySubmission: React.FC = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/project-submissions/user/${submissionId}`);
      const data = await response.json();
      setSubmission(data.data);
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Submission Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Project Submission - View Only
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            This submission has been completed and is now in read-only mode.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">{submission.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{submission.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Links</h4>
                  {submission.githubLink && (
                    <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Github className="w-4 h-4" /> GitHub Repository
                    </a>
                  )}
                  {submission.demoUrl && (
                    <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Link className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <TeamTechDisplay 
            teamMembers={submission.teamMembers}
            technologies={submission.technologies}
            features={submission.features}
            readOnly={true}
          />

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlySubmission;
