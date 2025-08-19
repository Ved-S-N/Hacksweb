import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Trophy,
  Tag,
  Upload,
  Eye,
  Save,
  ArrowLeft,
  Plus,
  X,
  DollarSign,
  Clock,
  Image,
  FileText,
  ListChecks,
  Award,
  Building,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    longDescription: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    isOnline: false,
    totalPrize: 0,
    maxParticipants: 100,
    participants: 0,
    status: "upcoming",
    banner: "",
    organizerId: 1,
    tags: [] as string[],
    rules: [] as string[],
    tracks: [] as { name: string }[],
    timeline: [] as { phase: string; date: string }[],
    sponsors: [] as string[],
  });

  const navigate = useNavigate();

  const progress = (currentStep / 4) * 100;

  const handleSubmit = async () => {
    try {
      const payload = {
        ...eventData,
        startDate: eventData.startDate.toISOString(),
        endDate: eventData.endDate.toISOString(),
        tags: eventData.tags,
        rules: eventData.rules,
        tracks: eventData.tracks,
        timeline: eventData.timeline.map((item) => ({
          phase: item.phase,
          date: item.date,
        })),
        sponsors: eventData.sponsors,
      };

      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Event created successfully!");
        navigate("/events");
      } else {
        toast.error("Failed to create event: " + data.error);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred while creating the event.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/5 to-primary-hover/5 py-8 border-b">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Event</h1>
                <p className="text-muted-foreground">
                  Set up your hackathon and start building an amazing community
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-8">
        <div className="container max-w-4xl">
          <Tabs value={`step${currentStep}`} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="step1" onClick={() => setCurrentStep(1)}>
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="step2" onClick={() => setCurrentStep(2)}>
                Details
              </TabsTrigger>
              <TabsTrigger value="step3" onClick={() => setCurrentStep(3)}>
                Advanced
              </TabsTrigger>
              <TabsTrigger value="step4" onClick={() => setCurrentStep(4)}>
                Review
              </TabsTrigger>
            </TabsList>

            {/* Step 1: Basic Information */}
            <TabsContent value="step1" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Let's start with the fundamental details of your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. AI Innovation Challenge 2024"
                      value={eventData.title}
                      onChange={(e) =>
                        setEventData({ ...eventData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event, its goals, and what participants can expect..."
                      className="min-h-[120px]"
                      value={eventData.description}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Long Description</Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Provide a detailed description of the event..."
                      className="min-h-[120px]"
                      value={eventData.longDescription}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          longDescription: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventData.startDate.toLocaleDateString()}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={eventData.startDate}
                            onSelect={(date) =>
                              date &&
                              setEventData({ ...eventData, startDate: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventData.endDate.toLocaleDateString()}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={eventData.endDate}
                            onSelect={(date) =>
                              date &&
                              setEventData({ ...eventData, endDate: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        min="1"
                        value={eventData.maxParticipants}
                        onChange={(e) =>
                          setEventData({
                            ...eventData,
                            maxParticipants: parseInt(e.target.value) || 100,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalPrize">Total Prize Pool ($)</Label>
                      <Input
                        id="totalPrize"
                        type="number"
                        min="0"
                        value={eventData.totalPrize}
                        onChange={(e) =>
                          setEventData({
                            ...eventData,
                            totalPrize: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA"
                      value={eventData.location}
                      onChange={(e) =>
                        setEventData({ ...eventData, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Is Online Event</Label>
                    <Switch
                      checked={eventData.isOnline}
                      onCheckedChange={(checked) =>
                        setEventData({ ...eventData, isOnline: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input
                      placeholder="Enter tags separated by commas"
                      value={eventData.tags.join(", ")}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner">Event Banner URL</Label>
                    <Input
                      id="banner"
                      placeholder="https://example.com/banner.jpg"
                      value={eventData.banner}
                      onChange={(e) =>
                        setEventData({ ...eventData, banner: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next: Advanced
                </Button>
              </div>
            </TabsContent>

            {/* Step 3: Advanced Settings */}
            <TabsContent value="step3" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure tracks, rules, timeline, and sponsors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tracks</Label>
                    <Textarea
                      placeholder="Enter track names, one per line"
                      className="min-h-[120px]"
                      value={eventData.tracks.map((t) => t.name).join("\n")}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          tracks: e.target.value
                            .split("\n")
                            .filter((name) => name.trim())
                            .map((name) => ({ name: name.trim() })),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rules</Label>
                    <Textarea
                      placeholder="Enter rules, one per line"
                      className="min-h-[150px]"
                      value={eventData.rules.join("\n")}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          rules: e.target.value
                            .split("\n")
                            .filter((r) => r.trim() !== ""),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Timeline</Label>
                    <Textarea
                      placeholder="Phase - YYYY-MM-DD"
                      className="min-h-[120px]"
                      value={eventData.timeline
                        .map((item) => `${item.phase} - ${item.date}`)
                        .join("\n")}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          timeline: e.target.value
                            .split("\n")
                            .filter((t) => t.trim())
                            .map((line) => {
                              const [phase, date] = line.split(" - ");
                              return {
                                phase: phase.trim(),
                                date: date?.trim() || "",
                              };
                            }),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sponsors</Label>
                    <Textarea
                      placeholder="Enter sponsor names, one per line"
                      className="min-h-[120px]"
                      value={eventData.sponsors.join("\n")}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          sponsors: e.target.value
                            .split("\n")
                            .filter((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous
                </Button>
                <Button onClick={handleSubmit} className="bg-primary">
                  Publish Event
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CreateEvent;
