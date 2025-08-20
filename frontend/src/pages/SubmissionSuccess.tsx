import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Eye } from 'lucide-react';

const SubmissionSuccess: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Submission Successful!</CardTitle>
          <CardDescription>
            Your project has been successfully submitted to the hackathon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for participating! Your submission is now under review.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You will receive updates via email regarding the judging process.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={() => navigate(`/events/${eventId}`)}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Event
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;
