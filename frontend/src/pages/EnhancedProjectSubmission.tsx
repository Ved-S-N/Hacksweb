import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Github, Link, Users, FileText, Video, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SubmissionData {
  projectName: string;
  description: string;
  longDescription: string;
  githubUrl: string;
  demoUrl: string;
  videoUrl: string;
  track: string;
  technologies: string[];
  features: string[];
  challenges: string;
  futureScope: string;
  teamMembers: TeamMember[];
  screenshots: File[];
  presentation: File[];
  codeFiles: File[];
  reportFile: File | null;
}

const EnhancedProjectSubmission: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [progress, setProgress] = useState(0);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    projectName: '',
    description: '',
    longDescription: '',
    githubUrl: '',
    demoUrl: '',
    videoUrl: '',
    track: '',
    technologies: [],
    features: [],
    challenges: '',
    futureScope: '',
    teamMembers: [],
    screenshots: [],
    presentation: [],
    codeFiles: [],
    reportFile: null
  });

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchEventDetails();
    fetchTeamData();
  }, [eventId]);

  useEffect(() => {
    calculateProgress();
  }, [submissionData]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setEventDetails(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch event details',
        variant: 'destructive',
      });
    }
  };

  const fetchTeamData = async () => {
    try {
      const response = await fetch(`/api/teams/user/${user?.id}/event/${eventId}`);
      const data = await response.json();
      setTeam(data);
      if (data?.members) {
        setSubmissionData(prev => ({ ...prev, teamMembers: data.members }));
      }
    } catch (error) {
      console.log('No team found');
    }
  };

  const calculateProgress = () => {
    const requiredFields = [
      submissionData.projectName,
      submissionData.description,
      submissionData.githubUrl,
      submissionData.track
    ];
    const filledFields = requiredFields.filter(field => field.trim() !== '').length;
    setProgress((filledFields / requiredFields.length) * 100);
  };

  const handleInputChange = (field: keyof SubmissionData, value: any) => {
    setSubmissionData(prev => ({ ...prev, [field]: value }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !submissionData.technologies.includes(techInput.trim())) {
      setSubmissionData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !submissionData.features.includes(featureInput.trim())) {
      setSubmissionData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setSubmissionData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const removeFeature = (feature: string) => {
    setSubmissionData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleFileUpload = async (files: File[], type: string): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);
    formData.append('eventId', eventId!);

    try {
      const response = await fetch('/api/project-submissions/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.urls || [];
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload all files first
      const screenshotUrls = await handleFileUpload(submissionData.screenshots, 'screenshots');
      const presentationUrls = await handleFileUpload(submissionData.presentation, 'presentation');
      const codeFileUrls = await handleFileUpload(submissionData.codeFiles, 'code');
      const reportUrls = submissionData.reportFile 
        ? await handleFileUpload([submissionData.reportFile], 'report')
        : [];

      const submissionPayload = {
        ...submissionData,
        screenshots: screenshotUrls,
        presentation: presentationUrls,
        codeFiles: codeFileUrls,
        reportFile: reportUrls[0] || '',
        eventId,
        teamId: team?.id,
        userId: user?.id,
      };

      const response = await fetch('/api/project-submissions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Your project has been submitted successfully',
        });
        navigate(`/events/${eventId}/submission-success`);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit project',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Submission Portal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {eventDetails?.name || "Hackathon"} - Submit Your Project
          </p>
          
          <div className="mt-4">
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="project">Project Details</TabsTrigger>
              <TabsTrigger value="team">Team & Tech</TabsTrigger>
              <TabsTrigger value="files">Files & Assets</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Basic details about your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      value={submissionData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      placeholder="Enter your project name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      value={submissionData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of your project"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="longDescription">Detailed Description</Label>
                    <Textarea
                      id="longDescription"
                      value={submissionData.longDescription}
                      onChange={(e) => handleInputChange('longDescription', e.target.value)}
                      placeholder="Detailed description of your project"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubUrl">GitHub Repository URL *</Label>
                      <Input
                        id="githubUrl"
                        type="url"
                        value={submissionData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        placeholder="https://github.com/username/project"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="demoUrl">Live Demo URL</Label>
                      <Input
                        id="demoUrl"
                        type="url"
                        value={submissionData.demoUrl}
                        onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                        placeholder="https://your-demo-url.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="videoUrl">Video Presentation URL</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={submissionData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="track">Track/Category *</Label>
                    <Select value={submissionData.track} onValueChange={(value) => handleInputChange('track', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile Development</SelectItem>
                        <SelectItem value="ai">AI/ML</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                        <SelectItem value="iot">IoT</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Technical and project-specific information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Key Features</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a feature"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={addFeature} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {submissionData.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeFeature(feature)}
                        >
                          {feature} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Technologies Used</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a technology"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTechnology();
                          }
                        }}
                      />
                      <Button type="button" onClick={addTechnology} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {submissionData.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTechnology(tech)}
                        >
                          {tech} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="challenges">Challenges Faced & Solutions</Label>
                    <Textarea
                      id="challenges"
                      value={submissionData.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      placeholder="Describe the challenges you faced and how you overcame them"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="futureScope">Future Scope & Improvements</Label>
                    <Textarea
                      id="futureScope"
                      value={submissionData.futureScope}
                      onChange={(e) => handleInputChange('futureScope', e.target.value)}
                      placeholder="What would you improve or add in the future?"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Information</CardTitle>
                  <CardDescription>Your team members and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissionData.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{member.email}</p>
                        </div>
                        <Badge variant="outline">{member.role || "Member"}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Screenshots
                    </CardTitle>
                    <CardDescription>Upload screenshots of your project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleInputChange('screenshots', Array.from(e.target.files || []))}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submissionData.screenshots.length} file(s) selected
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Presentation
                    </CardTitle>
                    <CardDescription>Upload your presentation file (PDF/PPT)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => handleInputChange('presentation', Array.from(e.target.files || []))}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submissionData.presentation.length} file(s) selected
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Code Files
                    </CardTitle>
                    <CardDescription>Upload additional code files or ZIP</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      multiple
                      accept=".zip,.js,.py,.java,.cpp,.c,.html,.css,.json"
                      onChange={(e) => handleInputChange('codeFiles', Array.from(e.target.files || []))}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submissionData.codeFiles.length} file(s) selected
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Project Report
                    </CardTitle>
                    <CardDescription>Upload your detailed project report (PDF)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleInputChange('reportFile', e.target.files?.[0] || null)}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submissionData.reportFile ? "1 file selected" : "No file selected"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Submission</CardTitle>
                  <CardDescription>
                    Please review all information before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      Please review all information carefully before submitting. Once submitted, you may not be able to make changes.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Submission Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Project:</strong> {submissionData.projectName || "Not specified"}</p>
                        <p><strong>GitHub:</strong> {submissionData.githubUrl || "Not specified"}</p>
                        <p><strong>Demo URL:</strong> {submissionData.demoUrl || "Not specified"}</p>
                        <p><strong>Video URL:</strong> {submissionData.videoUrl || "Not specified"}</p>
                      </div>
                      <div>
                        <p><strong>Technologies:</strong> {submissionData.technologies.join(", ") || "None"}</p>
                        <p><strong>Features:</strong> {submissionData.features.join(", ") || "None"}</p>
                        <p><strong>Team Size:</strong> {submissionData.teamMembers.length}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || progress < 100}
                    size="lg"
                  >
                    {loading ? "Submitting..." : "Complete Submission"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default EnhancedProjectSubmission;
