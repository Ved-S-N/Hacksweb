import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import LiveSubmissionButton from "@/components/LiveSubmissionButton";
import TeamTechDisplay from "@/components/TeamTechDisplay";
import { PlusCircle, ArrowRight, Users, Code, Settings } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isLive: boolean;
  status: string;
}

interface Submission {
  id: number;
  title: string;
  description: string;
  githubLink?: string;
  videoLink?: string;
  status: string;
  createdAt: string;
  submittedAt?: string;
  technologies: string[];
  features: string[];
  team: {
    id: number;
    name: string;
    members: Array<{
      id: number;
      name: string;
      email: string;
      role?: string;
    }>;
  };
}

interface Round {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  roundNumber: number;
}

const SubmissionPortal: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (eventId) {
      loadEventData();
      loadTeamData();
    }
  }, [eventId]);

  const loadEventData = async () => {
    try {
      // Load event data
      const eventRes = await fetch(
        `http://localhost:3000/api/events/${eventId}`
      );

      if (!eventRes.ok) {
        throw new Error(`Event not found: ${eventRes.status}`);
      }

      const eventData = await eventRes.json();
      setEvent(eventData);

      // Load submissions for this event and user
      const submissionsRes = await fetch(
        `http://localhost:3000/api/project-submissions/event/${eventId}`
      );
      
      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        // Filter submissions for current user/team
        const userSubmissions = submissionsData.data?.filter(
          (submission: any) => submission.userId === parseInt(user?.id?.toString() || '0') || 
          submission.team?.members?.some((member: any) => member.id === parseInt(user?.id?.toString() || '0'))
        ) || [];
        setSubmissions(userSubmissions);
      } else {
        console.log("No submissions found for this event");
        setSubmissions([]);
      }

      // Initialize empty rounds array
      setRounds([]);
    } catch (error) {
      console.error("Error loading event data:", error);
      toast.error("Failed to load event data");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/teams/user/${user?.id}/event/${eventId}`
      );
      const teamData = await response.json();
      setTeam(teamData);
    } catch (error) {
      console.error("Failed to load team data:", error);
    }
  };

  const handleSubmissionSuccess = () => {
    loadEventData();
    toast.success("Submission created successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p>The requested event could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <Badge variant={event.isLive ? "default" : "secondary"}>
            {event.isLive ? "LIVE" : event.status}
          </Badge>
          <span className="text-sm text-gray-500">
            {new Date(event.startDate).toLocaleDateString()} -{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </span>
        </div>

        {event.isLive && team && (
          <LiveSubmissionButton
            eventId={parseInt(eventId!)}
            teamId={team.id}
            onSubmit={handleSubmissionSuccess}
          />
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          <TabsTrigger value="team-tech">Team & Tech</TabsTrigger>
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Submission Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">{submissions.length}</div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">{rounds.length}</div>
                  <div className="text-sm text-gray-600">Rounds</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {team?.members?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">My Submissions</h3>
              <Button 
                onClick={() => navigate(`/submit/${eventId}/enhanced`)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
              >
                <PlusCircle className="w-4 h-4" />
                Enhanced Submission
              </Button>
            </div>
            
            {submissions
              .filter((s) => s.team.id === team?.id)
              .map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{submission.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {submission.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Submitted:{" "}
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {team &&
              submissions.filter((s) => s.team.id === team.id).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500 mb-4">No submissions yet</p>
                    <Button onClick={() => navigate(`/events/${eventId}/submit`)}>
                      Create New Submission
                    </Button>
                  </CardContent>
                </Card>
              )}
          </div>
        </TabsContent>

        <TabsContent value="team-tech">
          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div key={submission.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{submission.title}</h3>
                  <TeamTechDisplay 
                    teamMembers={submission.team?.members || []}
                    technologies={submission.technologies || []}
                    features={submission.features || []}
                  />
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No submissions with team and tech data available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rounds">
          <div className="space-y-4">
            {rounds.map((round) => (
              <Card key={round.id}>
                <CardHeader>
                  <CardTitle>
                    Round {round.roundNumber}: {round.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{round.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">
                        Start: {new Date(round.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        End: {new Date(round.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Submit for Round
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmissionPortal;
