// import { useState } from "react";
// import { Navbar } from "@/components/layout/Navbar";
// import { Footer } from "@/components/layout/Footer";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router-dom";
// import { toast } from "@/components/ui/sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import {
//   Calendar as CalendarIcon,
//   MapPin,
//   Users,
//   Trophy,
//   Tag,
//   Upload,
//   Eye,
//   Save,
//   ArrowLeft,
//   Plus,
//   X,
//   DollarSign,
//   Clock,
//   Image,
//   FileText,
//   ListChecks,
//   Award,
//   Building,
//   Link as LinkIcon,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const CreateEvent = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [eventData, setEventData] = useState({
//     title: "",
//     description: "",
//     longDescription: "",
//     startDate: new Date(),
//     endDate: new Date(),
//     location: "",
//     isOnline: false,
//     totalPrize: 0,
//     maxParticipants: 100,
//     participants: 0,
//     status: "upcoming",
//     banner: "",
//     organizerId: 1,
//     tags: [] as string[],
//     rules: [] as string[],
//     tracks: [] as { name: string }[],
//     timeline: [] as { phase: string; date: string }[],
//     sponsors: [] as string[],
//   });

//   const navigate = useNavigate();

//   const progress = (currentStep / 4) * 100;

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         ...eventData,
//         startDate: eventData.startDate.toISOString(),
//         endDate: eventData.endDate.toISOString(),
//         tags: eventData.tags,
//         rules: eventData.rules,
//         tracks: eventData.tracks,
//         timeline: eventData.timeline.map((item) => ({
//           phase: item.phase,
//           date: item.date,
//         })),
//         sponsors: eventData.sponsors,
//       };

//       const response = await fetch("http://localhost:3000/api/events", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Event created successfully!");
//         navigate("/events");
//       } else {
//         toast.error("Failed to create event: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error creating event:", error);
//       toast.error("An error occurred while creating the event.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Header */}
//       <section className="bg-gradient-to-r from-primary/5 to-primary-hover/5 py-8 border-b">
//         <div className="container">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="sm" asChild>
//                 <Link to="/dashboard">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Dashboard
//                 </Link>
//               </Button>
//               <div>
//                 <h1 className="text-2xl font-bold">Create New Event</h1>
//                 <p className="text-muted-foreground">
//                   Set up your hackathon and start building an amazing community
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6">
//             <div className="flex justify-between text-sm text-muted-foreground mb-2">
//               <span>Step {currentStep} of 4</span>
//               <span>{Math.round(progress)}% complete</span>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>
//         </div>
//       </section>

//       {/* Form Content */}
//       <section className="py-8">
//         <div className="container max-w-4xl">
//           <Tabs value={`step${currentStep}`} className="space-y-6">
//             <TabsList className="grid grid-cols-4 w-full">
//               <TabsTrigger value="step1" onClick={() => setCurrentStep(1)}>
//                 Basic Info
//               </TabsTrigger>
//               <TabsTrigger value="step2" onClick={() => setCurrentStep(2)}>
//                 Details
//               </TabsTrigger>
//               <TabsTrigger value="step3" onClick={() => setCurrentStep(3)}>
//                 Advanced
//               </TabsTrigger>
//               <TabsTrigger value="step4" onClick={() => setCurrentStep(4)}>
//                 Review
//               </TabsTrigger>
//             </TabsList>

//             {/* Step 1: Basic Information */}
//             <TabsContent value="step1" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Basic Information</CardTitle>
//                   <CardDescription>
//                     Let's start with the fundamental details of your event
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="title">Event Title *</Label>
//                     <Input
//                       id="title"
//                       placeholder="e.g. AI Innovation Challenge 2024"
//                       value={eventData.title}
//                       onChange={(e) =>
//                         setEventData({ ...eventData, title: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description">Description *</Label>
//                     <Textarea
//                       id="description"
//                       placeholder="Describe your event, its goals, and what participants can expect..."
//                       className="min-h-[120px]"
//                       value={eventData.description}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           description: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="longDescription">Long Description</Label>
//                     <Textarea
//                       id="longDescription"
//                       placeholder="Provide a detailed description of the event..."
//                       className="min-h-[120px]"
//                       value={eventData.longDescription}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           longDescription: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Start Date *</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className="w-full justify-start"
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {eventData.startDate.toLocaleDateString()}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={eventData.startDate}
//                             onSelect={(date) =>
//                               date &&
//                               setEventData({ ...eventData, startDate: date })
//                             }
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>

//                     <div className="space-y-2">
//                       <Label>End Date *</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className="w-full justify-start"
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {eventData.endDate.toLocaleDateString()}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={eventData.endDate}
//                             onSelect={(date) =>
//                               date &&
//                               setEventData({ ...eventData, endDate: date })
//                             }
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="location">Location</Label>
//                     <Input
//                       id="location"
//                       placeholder="e.g. San Francisco, CA"
//                       value={eventData.location}
//                       onChange={(e) =>
//                         setEventData({ ...eventData, location: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Event Type</Label>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="radio"
//                           id="locationEvent"
//                           name="eventType"
//                           checked={!eventData.isOnline}
//                           onChange={() =>
//                             setEventData({ ...eventData, isOnline: false })
//                           }
//                           className="h-4 w-4"
//                         />
//                         <Label htmlFor="locationEvent">Physical Location</Label>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="radio"
//                           id="onlineEvent"
//                           name="eventType"
//                           checked={eventData.isOnline}
//                           onChange={() =>
//                             setEventData({ ...eventData, isOnline: true })
//                           }
//                           className="h-4 w-4"
//                         />
//                         <Label htmlFor="onlineEvent">Online</Label>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-between">
//                     <Button variant="outline" onClick={() => setCurrentStep(2)}>
//                       Previous
//                     </Button>
//                     <Button onClick={() => setCurrentStep(2)}>
//                       Next: Details
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Step 2: Details */}
//             <TabsContent value="step2" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Event Details</CardTitle>
//                   <CardDescription>
//                     Add more specific details about your event
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="maxParticipants">
//                         Maximum Participants
//                       </Label>
//                       <Input
//                         id="maxParticipants"
//                         type="number"
//                         placeholder="100"
//                         value={eventData.maxParticipants}
//                         onChange={(e) =>
//                           setEventData({
//                             ...eventData,
//                             maxParticipants: parseInt(e.target.value) || 0,
//                           })
//                         }
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="totalPrize">Total Prize Pool ($)</Label>
//                       <Input
//                         id="totalPrize"
//                         type="number"
//                         placeholder="5000"
//                         value={eventData.totalPrize}
//                         onChange={(e) =>
//                           setEventData({
//                             ...eventData,
//                             totalPrize: parseInt(e.target.value) || 0,
//                           })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="tags">Tags</Label>
//                     <Input
//                       id="tags"
//                       placeholder="Enter tags separated by commas (e.g. AI, Web3, Blockchain)"
//                       value={eventData.tags.join(", ")}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           tags: e.target.value
//                             .split(",")
//                             .map((tag) => tag.trim())
//                             .filter((tag) => tag),
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="banner">Banner Image URL</Label>
//                     <Input
//                       id="banner"
//                       placeholder="https://example.com/banner.jpg"
//                       value={eventData.banner}
//                       onChange={(e) =>
//                         setEventData({ ...eventData, banner: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <Button variant="outline" onClick={() => setCurrentStep(1)}>
//                       Previous
//                     </Button>
//                     <Button onClick={() => setCurrentStep(3)}>
//                       Next: Advanced
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Step 3: Advanced Settings */}
//             <TabsContent value="step3" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Advanced Settings</CardTitle>
//                   <CardDescription>
//                     Configure tracks, rules, timeline, and sponsors
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label>Tracks</Label>
//                     <Textarea
//                       placeholder="Enter track names, one per line"
//                       className="min-h-[120px]"
//                       value={eventData.tracks.map((t) => t.name).join("\n")}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           tracks: e.target.value
//                             .split("\n")
//                             .filter((name) => name.trim())
//                             .map((name) => ({ name: name.trim() })),
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Rules</Label>
//                     <Textarea
//                       placeholder="Enter rules, one per line"
//                       className="min-h-[150px]"
//                       value={eventData.rules.join("\n")}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           rules: e.target.value
//                             .split("\n")
//                             .filter((r) => r.trim() !== ""),
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Timeline</Label>
//                     <Textarea
//                       placeholder="Phase - YYYY-MM-DD"
//                       className="min-h-[120px]"
//                       value={eventData.timeline
//                         .map((item) => `${item.phase} - ${item.date}`)
//                         .join("\n")}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           timeline: e.target.value
//                             .split("\n")
//                             .filter((t) => t.trim())
//                             .map((line) => {
//                               const [phase, date] = line.split(" - ");
//                               return {
//                                 phase: phase.trim(),
//                                 date: date?.trim() || "",
//                               };
//                             }),
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Sponsors</Label>
//                     <Textarea
//                       placeholder="Enter sponsor names, one per line"
//                       className="min-h-[120px]"
//                       value={eventData.sponsors.join("\n")}
//                       onChange={(e) =>
//                         setEventData({
//                           ...eventData,
//                           sponsors: e.target.value
//                             .split("\n")
//                             .filter((s) => s.trim()),
//                         })
//                       }
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setCurrentStep(2)}>
//                   Previous
//                 </Button>
//                 <Button onClick={() => setCurrentStep(4)}>Next: Review</Button>
//               </div>
//             </TabsContent>

//             {/* Step 4: Review */}
//             <TabsContent value="step4" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Review Your Event</CardTitle>
//                   <CardDescription>
//                     Please review all the details before publishing your event
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="font-semibold text-lg mb-2">
//                         Basic Information
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="font-medium">Title:</span>{" "}
//                           {eventData.title || "Not set"}
//                         </div>
//                         <div>
//                           <span className="font-medium">Location:</span>{" "}
//                           {eventData.location || "Not set"}
//                         </div>
//                         <div>
//                           <span className="font-medium">Start Date:</span>{" "}
//                           {eventData.startDate.toLocaleDateString()}
//                         </div>
//                         <div>
//                           <span className="font-medium">End Date:</span>{" "}
//                           {eventData.endDate.toLocaleDateString()}
//                         </div>
//                         <div>
//                           <span className="font-medium">Type:</span>{" "}
//                           {eventData.isOnline ? "Online" : "Physical"}
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <span className="font-medium">Description:</span>
//                         <p className="text-muted-foreground">
//                           {eventData.description || "Not provided"}
//                         </p>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="font-semibold text-lg mb-2">
//                         Event Details
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="font-medium">Max Participants:</span>{" "}
//                           {eventData.maxParticipants}
//                         </div>
//                         <div>
//                           <span className="font-medium">Prize Pool:</span> $
//                           {eventData.totalPrize.toLocaleString()}
//                         </div>
//                         <div>
//                           <span className="font-medium">Tags:</span>{" "}
//                           {eventData.tags.join(", ") || "None"}
//                         </div>
//                         <div>
//                           <span className="font-medium">Banner:</span>{" "}
//                           {eventData.banner ? "Set" : "Not set"}
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="font-semibold text-lg mb-2">
//                         Advanced Settings
//                       </h3>
//                       <div className="space-y-2 text-sm">
//                         <div>
//                           <span className="font-medium">Tracks:</span>{" "}
//                           {eventData.tracks.length || "None"}
//                         </div>
//                         <div>
//                           <span className="font-medium">Rules:</span>{" "}
//                           {eventData.rules.length || "None"}
//                         </div>
//                         <div>
//                           <span className="font-medium">Timeline:</span>{" "}
//                           {eventData.timeline.length || "None"}
//                         </div>
//                         <div>
//                           <span className="font-medium">Sponsors:</span>{" "}
//                           {eventData.sponsors.length || "None"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-muted p-4 rounded-lg">
//                     <h4 className="font-medium mb-2">Summary</h4>
//                     <p className="text-sm text-muted-foreground">
//                       You're about to publish "
//                       {eventData.title || "Untitled Event"}" with a prize pool
//                       of ${eventData.totalPrize.toLocaleString()}
//                       and capacity for {eventData.maxParticipants} participants.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setCurrentStep(3)}>
//                   Previous
//                 </Button>
//                 <Button onClick={handleSubmit} className="bg-primary">
//                   <Save className="h-4 w-4 mr-2" />
//                   Publish Event
//                 </Button>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CreateEvent;

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
} from "lucide-react";
import { Link } from "react-router-dom";
// Using toLocaleDateString instead of date-fns for simplicity

const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    longDescription: "", // new field
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    isOnline: false,
    maxParticipants: 100,
    totalPrize: 1000,
    participants: 0, // default for new event
    status: "upcoming", // default status
    tags: [] as string[],
    rules: [] as string[], // array, not string
    banner: "", // optional
    organizerId: 1, // set after creating an organizer
    tracks: [] as any[],
    timeline: [],
    sponsors: [] as any[],
  });

  const [newTag, setNewTag] = useState("");
  const [newTrack, setNewTrack] = useState("");

  const addTag = () => {
    if (newTag && !eventData.tags.includes(newTag)) {
      setEventData({ ...eventData, tags: [...eventData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setEventData({
      ...eventData,
      tags: eventData.tags.filter((t) => t !== tag),
    });
  };

  const addTrack = () => {
    if (newTrack && !eventData.tracks.includes(newTrack)) {
      setEventData({ ...eventData, tracks: [...eventData.tracks, newTrack] });
      setNewTrack("");
    }
  };

  const removeTrack = (track: string) => {
    setEventData({
      ...eventData,
      tracks: eventData.tracks.filter((t) => t !== track),
    });
  };

  const progress = (currentStep / 4) * 100;

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
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Progress */}
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
            {/* Step Navigation */}
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="step1" onClick={() => setCurrentStep(1)}>
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="step2" onClick={() => setCurrentStep(2)}>
                Details
              </TabsTrigger>
              <TabsTrigger value="step3" onClick={() => setCurrentStep(3)}>
                Tracks & Rules
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

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={eventData.isOnline}
                        onCheckedChange={(checked) =>
                          setEventData({ ...eventData, isOnline: checked })
                        }
                      />
                      <Label>This is an online event</Label>
                    </div>

                    {!eventData.isOnline && (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="e.g. San Francisco, CA or Specific venue address"
                          value={eventData.location}
                          onChange={(e) =>
                            setEventData({
                              ...eventData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)}>
                  Next: Event Details
                </Button>
              </div>
            </TabsContent>

            {/* Step 2: Event Details */}
            <TabsContent value="step2" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>
                    Configure capacity, prizes, and categorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                            maxParticipants: parseInt(e.target.value) || 0,
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

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag (e.g. AI, Web3, Mobile)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button type="button" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {eventData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="space-y-2">
                    <Label>Event Banner</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 1200x600px
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next: Tracks & Rules
                </Button>
              </div>
            </TabsContent>

            {/* Step 3: Tracks & Rules */}
            <TabsContent value="step3" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tracks & Rules</CardTitle>
                  <CardDescription>
                    Define competition tracks and event rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tracks */}
                  <div className="space-y-2">
                    <Label>Competition Tracks</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a track (e.g. Best AI Innovation, Best Mobile App)"
                        value={newTrack}
                        onChange={(e) => setNewTrack(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTrack()}
                      />
                      <Button type="button" onClick={addTrack}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {eventData.tracks.map((track) => (
                        <div
                          key={track}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <span>{track}</span>
                          <X
                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                            onClick={() => removeTrack(track)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="space-y-2">
                    <Label htmlFor="rules">Event Rules</Label>
                    <Textarea
                      id="rules"
                      placeholder="One rule per line..."
                      className="min-h-[150px]"
                      value={eventData.rules.join("\n")} // join array for display
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          rules: e.target.value
                            .split("\n")
                            .filter((r) => r.trim() !== ""), // split into array
                        })
                      }
                    />
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Event Timeline</Label>
                    <Textarea
                      id="timeline"
                      placeholder="One phase per line, e.g. 'Registration - 2025-08-20'"
                      className="min-h-[120px]"
                      value={eventData.timeline.join("\n")}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          timeline: e.target.value
                            .split("\n")
                            .filter((t) => t.trim() !== ""),
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
                <Button onClick={() => setCurrentStep(4)}>Next: Review</Button>
              </div>
            </TabsContent>

            {/* Step 4: Review */}
            <TabsContent value="step4" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Publish</CardTitle>
                  <CardDescription>
                    Review your event details before publishing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Event Title</h3>
                        <p className="text-muted-foreground">
                          {eventData.title || "Not set"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Description</h3>
                        <p className="text-muted-foreground text-sm">
                          {eventData.description || "Not set"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Date & Location</h3>
                        <p className="text-muted-foreground text-sm">
                          {eventData.startDate.toLocaleDateString()} -{" "}
                          {eventData.endDate.toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {eventData.isOnline
                            ? "Online Event"
                            : eventData.location || "Location not set"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Capacity & Prizes</h3>
                        <p className="text-muted-foreground text-sm">
                          Max {eventData.maxParticipants} participants
                        </p>
                        <p className="text-muted-foreground text-sm">
                          ${eventData.totalPrize.toLocaleString()} total prize
                          pool
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {eventData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">Tracks</h3>
                        <ul className="text-muted-foreground text-sm mt-1">
                          {eventData.tracks.map((track) => (
                            <li key={track}>• {track}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Previous
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">Save as Draft</Button>
                  {/* <Button>
                    Publish Event
                  </Button> */}
                  <Button
                    onClick={async () => {
                      try {
                        console.log(
                          "timeline before submit:",
                          eventData.timeline
                        );
                        console.log("eventData being sent:", {
                          ...eventData,
                          timeline: eventData.timeline,
                        });
                        console.log("FINAL PAYLOAD:", {
                          tags: eventData.tags || [],
                          rules: eventData.rules || [],
                          tracks: eventData.tracks || [],
                          timeline: eventData.timeline || [],
                          sponsors: eventData.sponsors || [],
                        });

                        const response = await fetch(
                          "http://localhost:3000/api/events",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              title: eventData.title,
                              description: eventData.description,
                              longDescription: eventData.longDescription,
                              startDate: eventData.startDate.toISOString(),
                              endDate: eventData.endDate.toISOString(),
                              location: eventData.location,
                              isOnline: eventData.isOnline,
                              totalPrize: eventData.totalPrize,
                              maxParticipants: eventData.maxParticipants,
                              participants: 0,
                              status: "Published",
                              banner: eventData.banner || null,
                              organizerId: 1, // or dynamic

                              // ⬇️ Replace these with safe versions
                              tags: Array.isArray(eventData.tags)
                                ? eventData.tags
                                : [],
                              rules: Array.isArray(eventData.rules)
                                ? eventData.rules
                                : [],

                              tracks: Array.isArray(eventData.tracks)
                                ? eventData.tracks.map((track) => ({
                                    name: track.name,
                                  }))
                                : [],

                              timeline: Array.isArray(eventData.timeline)
                                ? eventData.timeline.map((item) =>
                                    typeof item === "string"
                                      ? {
                                          phase: item,
                                          date: new Date().toISOString(),
                                        }
                                      : {
                                          phase: item.phase,
                                          date:
                                            item.date instanceof Date
                                              ? item.date.toISOString()
                                              : new Date(
                                                  item.date
                                                ).toISOString(),
                                        }
                                  )
                                : [],

                              sponsors: Array.isArray(eventData.sponsors)
                                ? eventData.sponsors.map((sponsor) => ({
                                    name: sponsor.name,
                                  }))
                                : [],
                            }),
                          }
                        );

                        const data = await response.json();
                        if (response.ok) {
                          toast.success("Event created successfully!");
                          window.location.href = "/events";
                        } else {
                          toast.error("Failed to publish event: " + data.error);
                        }
                      } catch (err) {
                        console.error(err);
                        alert("An error occurred while publishing the event.");
                      }
                    }}
                  >
                    Publish Event
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateEvent;
