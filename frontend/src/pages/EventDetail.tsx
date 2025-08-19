import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Star,
  Github,
  Globe,
  Play,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  totalPrize: number;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "ongoing" | "ended";
  tags: string[];
  organizer: {
    name: string;
    avatar?: string;
    description?: string;
    website?: string;
  };
  banner?: string;
  tracks: Array<{
    name: string;
    prize: number;
  }>;
  timeline: Array<{
    phase: string;
    date: string;
  }>;
  rules: string[];
  sponsors: Array<{
    name: string;
  }>;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/events/${id}`);
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();

        // Parse JSON strings back to arrays
        const parsedData = {
          ...data,
          tags: data.tags ? JSON.parse(data.tags) : [],
          rules: data.rules ? JSON.parse(data.rules) : [],
          tracks: data.tracks || [],
          timeline: data.timeline || [],
          sponsors: data.sponsors || [],
          organizer: data.organizer || { name: "Unknown Organizer" },
        };

        setEvent(parsedData);

        // Check registration status if user is logged in
        if (user) {
          checkRegistrationStatus();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `http://localhost:3000/api/events/${id}/registrations/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsRegistered(data.isRegistered);
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please sign in to register for events");
      navigate("/signin", { state: { from: `/event/${id}` } });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please sign in to register for events");
        navigate("/signin", { state: { from: `/event/${id}` } });
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/events/${id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsRegistered(true);
        toast.success("Successfully registered for the event!");

        // Refresh event data to update participant count
        const updatedResponse = await fetch(
          `http://localhost:3000/api/events/${id}`
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          const parsedUpdatedData = {
            ...updatedData,
            tags: updatedData.tags ? JSON.parse(updatedData.tags) : [],
            rules: updatedData.rules ? JSON.parse(updatedData.rules) : [],
            tracks: updatedData.tracks || [],
            timeline: updatedData.timeline || [],
            sponsors: updatedData.sponsors || [],
            organizer: updatedData.organizer || { name: "Unknown Organizer" },
          };
          setEvent(parsedUpdatedData);
        }
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to register");
      }
    } catch (err) {
      toast.error("Failed to register for the event");
    }
  };

  const getStatusInfo = () => {
    if (!event) return null;

    switch (event.status) {
      case "upcoming":
        return {
          badge: <Badge variant="secondary">Upcoming</Badge>,
          action: isRegistered ? (
            <Button size="lg" disabled className="bg-green-600 text-white">
              Registered
            </Button>
          ) : (
            <Button size="lg" onClick={handleRegister}>
              Register Now
            </Button>
          ),
        };
      case "ongoing":
        return {
          badge: (
            <Badge className="bg-success text-success-foreground">
              Live Now
            </Badge>
          ),
          action: (
            <Button size="lg" className="bg-success hover:bg-success/90">
              Submit Project
            </Button>
          ),
        };
      case "ended":
        return {
          badge: <Badge variant="outline">Ended</Badge>,
          action: (
            <Button size="lg" variant="outline">
              View Results
            </Button>
          ),
        };
      default:
        return {
          badge: <Badge variant="secondary">Unknown</Badge>,
          action: (
            <Button size="lg" disabled>
              Unavailable
            </Button>
          ),
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link to="/events">Back to Events</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  const statusInfo = getStatusInfo();
  const projects = []; // This would come from submissions API

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary/20 to-primary-hover/20">
          {event.banner && (
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative -mt-32">
          <div className="bg-background rounded-lg shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/events">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Events
                    </Link>
                  </Button>
                  {statusInfo?.badge}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {event.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {event.description}
                </p>

                {/* Key Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2" />
                    <div>
                      <div className="font-medium text-foreground">
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <div>
                      <div className="font-medium text-foreground">
                        {event.isOnline ? "Online" : event.location}
                      </div>
                      <div className="text-sm">
                        {event.isOnline ? "Virtual Event" : "In-person"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-5 w-5 mr-2" />
                    <div>
                      <div className="font-medium text-foreground">
                        {event.participants.toLocaleString()} participants
                      </div>
                      <div className="text-sm">
                        {Math.round(
                          (event.participants / event.maxParticipants) * 100
                        )}
                        % full
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Trophy className="h-5 w-5 mr-2" />
                    <div>
                      <div className="font-medium text-foreground">
                        ${event.totalPrize.toLocaleString()}
                      </div>
                      <div className="text-sm">Total prizes</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 ml-8">
                {statusInfo?.action}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center space-x-4 pt-6 border-t">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                />
                <AvatarFallback>
                  {event.organizer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  Organized by {event.organizer.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.organizer.description}
                </div>
              </div>
              {event.organizer.website && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={event.organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-8">
        <div className="container">
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tracks">Tracks & Prizes</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                      <p>{event.longDescription || event.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rules & Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {event.rules.map((rule, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Registration Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{event.participants} registered</span>
                          <span>{event.maxParticipants} max</span>
                        </div>
                        <Progress
                          value={
                            (event.participants / event.maxParticipants) * 100
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">
                          {Math.ceil(
                            (new Date(event.endDate).getTime() -
                              new Date(event.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">2-5 members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracks</span>
                        <span className="font-medium">
                          {event.tracks.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Prizes
                        </span>
                        <span className="font-medium">
                          ${event.totalPrize.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Timeline</CardTitle>
                  <CardDescription>Key milestones and schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.timeline.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 text-right">
                          <div className="text-sm font-medium">
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex-shrink-0 mt-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {item.phase}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.tracks.map((track, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {track.name}
                        <Badge className="bg-warning text-warning-foreground">
                          ${track.prize?.toLocaleString() || "0"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Compete in this track to win the $
                        {track.prize?.toLocaleString() || "0"} prize.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Submitted Projects</h3>
                  <p className="text-muted-foreground">
                    Browse amazing projects from participants
                  </p>
                </div>
                <Badge>0 projects</Badge>
              </div>

              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No projects submitted yet
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sponsors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Sponsors</CardTitle>
                  <CardDescription>
                    Thank you to our amazing sponsors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {event.sponsors.map((sponsor, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">
                            {sponsor.name}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
