import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Github,
  Link,
  Users,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SubmissionData {
  projectName: string;
  description: string;
  githubLink: string;
  demoUrl: string;
  videoUrl: string;
  liveSubmissionUrl: string;
  teamMembers: TeamMember[];
  technologies: string[];
  features: string[];
  challenges: string;
  futureScope: string;
  screenshots: File[];
  presentation: File[];
  codeFiles: File[];
  reportFile: File | null;
}

const CompleteSubmission = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [submission, setSubmission] = useState<SubmissionData>({
    projectName: "",
    description: "",
    githubLink: "",
    demoUrl: "",
    videoUrl: "",
    liveSubmissionUrl: "",
    teamMembers: [],
    technologies: [],
    features: [],
    challenges: "",
    futureScope: "",
    screenshots: [],
    presentation: [],
    codeFiles: [],
    reportFile: null,
  });

  useEffect(() => {
    fetchEventDetails();
    fetchTeamData();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setEventDetails(data);
    } catch (error) {
      toast.error("Failed to fetch event details");
    }
  };

  const fetchTeamData = async () => {
    try {
      const response = await fetch(
        `/api/teams/user/${user?.id}/event/${eventId}`
      );
      const data = await response.json();
      setTeam(data);
      if (data?.members) {
        setSubmission((prev) => ({ ...prev, teamMembers: data.members }));
      }
    } catch (error) {
      console.log("No team found");
    }
  };

  const handleFileUpload = async (
    files: File[],
    type: string
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("type", type);
    formData.append("eventId", eventId!);

    try {
      const response = await fetch("/api/submissions/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.urls;
    } catch (error) {
      toast.error("Failed to upload files");
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload all files first
      const screenshotUrls = await handleFileUpload(
        submission.screenshots,
        "screenshots"
      );
      const presentationUrls = await handleFileUpload(
        submission.presentation,
        "presentation"
      );
      const codeFileUrls = await handleFileUpload(submission.codeFiles, "code");
      const reportUrls = submission.reportFile
        ? await handleFileUpload([submission.reportFile], "report")
        : [];

      const submissionData = {
        ...submission,
        screenshots: screenshotUrls,
        presentation: presentationUrls,
        codeFiles: codeFileUrls,
        reportFile: reportUrls[0] || "",
        eventId,
        teamId: team?.id,
        userId: user?.id,
      };

      const response = await fetch("/api/submissions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        toast.success("Submission completed successfully!");
        navigate(`/events/${eventId}/submission-success`);
      } else {
        toast.error("Failed to submit");
      }
    } catch (error) {
      toast.error("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    const tech = prompt("Enter technology name:");
    if (tech && !submission.technologies.includes(tech)) {
      setSubmission((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
    }
  };

  const addFeature = () => {
    const feature = prompt("Enter feature name:");
    if (feature && !submission.features.includes(feature)) {
      setSubmission((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
    }
  };

  const removeTechnology = (tech: string) => {
    setSubmission((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const removeFeature = (feature: string) => {
    setSubmission((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Your Submission
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {eventDetails?.name || "Hackathon"} - Final Submission Portal
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              <Users className="w-4 h-4 mr-1" />
              {team?.members?.length || 0} Team Members
            </Badge>
            <Badge variant="outline" className="text-sm">
              <FileText className="w-4 h-4 mr-1" />
              Complete Submission
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
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
                  <CardDescription>
                    Basic details about your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      value={submission.projectName}
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          projectName: e.target.value,
                        }))
                      }
                      placeholder="Enter your project name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      value={submission.description}
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your project in detail"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubLink">
                        GitHub Repository URL *
                      </Label>
                      <Input
                        id="githubLink"
                        type="url"
                        value={submission.githubLink}
                        onChange={(e) =>
                          setSubmission((prev) => ({
                            ...prev,
                            githubLink: e.target.value,
                          }))
                        }
                        placeholder="https://github.com/username/project"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="demoUrl">Live Demo URL</Label>
                      <Input
                        id="demoUrl"
                        type="url"
                        value={submission.demoUrl}
                        onChange={(e) =>
                          setSubmission((prev) => ({
                            ...prev,
                            demoUrl: e.target.value,
                          }))
                        }
                        placeholder="https://your-demo-url.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="liveSubmissionUrl">
                      Live Submission URL
                    </Label>
                    <Input
                      id="liveSubmissionUrl"
                      type="url"
                      value={submission.liveSubmissionUrl}
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          liveSubmissionUrl: e.target.value,
                        }))
                      }
                      placeholder="https://your-live-submission.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl">Video Presentation URL</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={submission.videoUrl}
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          videoUrl: e.target.value,
                        }))
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Technical and project-specific information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Key Features</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a feature"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
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
                      {submission.features.map((feature, index) => (
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
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
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
                      {submission.technologies.map((tech, index) => (
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
                    <Label htmlFor="challenges">
                      Challenges Faced & Solutions
                    </Label>
                    <Textarea
                      id="challenges"
                      value={submission.challenges}
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          challenges: e.target.value,
                        }))
                      }
                      placeholder="Describe the challenges you faced and how you overcame them"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="futureScope">
                      Future Scope & Improvements
                    </Label>
                    <Textarea
                      id="futureScope"
                      value={submission.futureScope}
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          futureScope: e.target.value,
                        }))
                      }
                      placeholder="What would you improve or add in the future?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Information</CardTitle>
                  <CardDescription>
                    Your team members and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submission.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {member.email}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {member.role || "Member"}
                        </Badge>
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
                    <CardDescription>
                      Upload screenshots of your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          screenshots: Array.from(e.target.files || []),
                        }))
                      }
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submission.screenshots.length} file(s) selected
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Presentation
                    </CardTitle>
                    <CardDescription>
                      Upload your presentation file (PDF/PPT)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          presentation: Array.from(e.target.files || []),
                        }))
                      }
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submission.presentation.length} file(s) selected
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Code Files
                    </CardTitle>
                    <CardDescription>
                      Upload additional code files or ZIP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      multiple
                      accept=".zip,.js,.py,.java,.cpp,.c,.html,.css,.json"
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          codeFiles: Array.from(e.target.files || []),
                        }))
                      }
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submission.codeFiles.length} file(s) selected
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Project Report
                    </CardTitle>
                    <CardDescription>
                      Upload your detailed project report (PDF)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setSubmission((prev) => ({
                          ...prev,
                          reportFile: e.target.files?.[0] || null,
                        }))
                      }
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {submission.reportFile
                        ? "1 file selected"
                        : "No file selected"}
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
                      Please review all information carefully before submitting.
                      Once submitted, you may not be able to make changes.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Submission Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Project:</strong>{" "}
                          {submission.projectName || "Not specified"}
                        </p>
                        <p>
                          <strong>GitHub:</strong>{" "}
                          {submission.githubLink || "Not specified"}
                        </p>
                        <p>
                          <strong>Demo URL:</strong>{" "}
                          {submission.demoUrl || "Not specified"}
                        </p>
                        <p>
                          <strong>Video URL:</strong>{" "}
                          {submission.videoUrl || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Technologies:</strong>{" "}
                          {submission.technologies.join(", ") || "None"}
                        </p>
                        <p>
                          <strong>Features:</strong>{" "}
                          {submission.features.join(", ") || "None"}
                        </p>
                        <p>
                          <strong>Team Size:</strong>{" "}
                          {submission.teamMembers.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
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

export default CompleteSubmission;
