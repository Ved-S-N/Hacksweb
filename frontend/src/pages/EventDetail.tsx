import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertCircle,
  Star,
  Github,
  Globe,
  Play
} from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);

  // Mock event data
  const event = {
    id: "1",
    title: "AI Innovation Challenge 2024",
    description: "Build the next generation of AI applications that solve real-world problems. This challenge focuses on creating innovative solutions using machine learning, natural language processing, and computer vision. Participants will have 48 hours to develop, test, and present their AI-powered applications.",
    longDescription: `
      The AI Innovation Challenge 2024 is designed to push the boundaries of artificial intelligence and machine learning. 
      We're looking for groundbreaking solutions that address real-world problems across various domains including healthcare, 
      education, sustainability, and social impact.

      Whether you're a seasoned AI researcher or a newcomer to the field, this challenge provides an opportunity to 
      collaborate with like-minded individuals and create something truly innovative.
    `,
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    location: "San Francisco, CA",
    isOnline: false,
    totalPrize: 50000,
    participants: 1250,
    maxParticipants: 2000,
    status: "upcoming" as "upcoming" | "ongoing" | "ended",
    tags: ["AI", "Machine Learning", "Innovation", "Computer Vision", "NLP"],
    organizer: {
      name: "TechCorp",
      avatar: "/placeholder-avatar.png",
      description: "Leading technology company focused on AI innovation",
      website: "https://techcorp.com"
    },
    banner: "/placeholder-banner.jpg",
    tracks: [
      { name: "Best AI Innovation", prize: 20000 },
      { name: "Best Social Impact", prize: 15000 },
      { name: "Best Technical Implementation", prize: 10000 },
      { name: "People's Choice", prize: 5000 }
    ],
    timeline: [
      { time: "09:00", event: "Registration & Check-in", date: "March 15" },
      { time: "10:00", event: "Opening Ceremony", date: "March 15" },
      { time: "11:00", event: "Team Formation & Networking", date: "March 15" },
      { time: "12:00", event: "Hacking Begins!", date: "March 15" },
      { time: "18:00", event: "Dinner & Networking", date: "March 15" },
      { time: "12:00", event: "Lunch Break", date: "March 16" },
      { time: "18:00", event: "Progress Check-in", date: "March 16" },
      { time: "10:00", event: "Final Presentations", date: "March 17" },
      { time: "14:00", event: "Judging & Awards", date: "March 17" },
      { time: "16:00", event: "Closing Ceremony", date: "March 17" }
    ],
    rules: [
      "Teams can have 2-5 members",
      "All code must be written during the event",
      "Open source libraries and APIs are allowed",
      "Submissions must include source code and demo",
      "No inappropriate content or harassment"
    ],
    sponsors: [
      { name: "Google Cloud", logo: "/placeholder-logo.png", tier: "Platinum" },
      { name: "Microsoft Azure", logo: "/placeholder-logo.png", tier: "Gold" },
      { name: "OpenAI", logo: "/placeholder-logo.png", tier: "Silver" }
    ]
  };

  const projects = [
    {
      id: "1",
      title: "MedAI Assistant",
      description: "AI-powered medical diagnosis assistant for remote healthcare",
      team: "HealthTech Innovators",
      members: 4,
      technologies: ["Python", "TensorFlow", "React"],
      github: "https://github.com/team/medai",
      demo: "https://demo.medai.com",
      votes: 127
    },
    {
      id: "2", 
      title: "EcoPredict",
      description: "Climate change prediction model using satellite data",
      team: "Green Coders",
      members: 3,
      technologies: ["PyTorch", "Satellite APIs", "Vue.js"],
      github: "https://github.com/team/ecopredict",
      demo: "https://demo.ecopredict.com",
      votes: 98
    }
  ];

  const getStatusInfo = () => {
    switch (event.status) {
      case "upcoming":
        return {
          badge: <Badge variant="secondary">Upcoming</Badge>,
          action: isRegistered ? 
            <Button size="lg" disabled>Registered</Button> :
            <Button size="lg" onClick={() => setIsRegistered(true)}>Register Now</Button>
        };
      case "ongoing":
        return {
          badge: <Badge className="bg-success text-success-foreground">Live Now</Badge>,
          action: <Button size="lg" className="bg-success hover:bg-success/90">Submit Project</Button>
        };
      case "ended":
        return {
          badge: <Badge variant="outline">Ended</Badge>,
          action: <Button size="lg" variant="outline">View Results</Button>
        };
      default:
        return {
          badge: <Badge variant="secondary">Unknown</Badge>,
          action: <Button size="lg" disabled>Unavailable</Button>
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary/20 to-primary-hover/20">
          {event.banner && (
            <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
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
                  {statusInfo.badge}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{event.description}</p>
                
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
                        {Math.round((event.participants / event.maxParticipants) * 100)}% full
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
                {statusInfo.action}
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
                <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Organized by {event.organizer.name}</div>
                <div className="text-sm text-muted-foreground">{event.organizer.description}</div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={event.organizer.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Website
                </a>
              </Button>
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
                      <p>{event.longDescription}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rules & Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {event.rules.map((rule, index) => (
                          <li key={index} className="flex items-start space-x-2">
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
                        <Progress value={(event.participants / event.maxParticipants) * 100} />
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
                        <span className="font-medium">48 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">2-5 members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracks</span>
                        <span className="font-medium">{event.tracks.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Prizes</span>
                        <span className="font-medium">${event.totalPrize.toLocaleString()}</span>
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
                          <div className="text-sm font-medium">{item.time}</div>
                          <div className="text-xs text-muted-foreground">{item.date}</div>
                        </div>
                        <div className="flex-shrink-0 mt-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.event}</div>
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
                          ${track.prize.toLocaleString()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Compete in this track to win the ${track.prize.toLocaleString()} prize.
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
                  <p className="text-muted-foreground">Browse amazing projects from participants</p>
                </div>
                <Badge>{projects.length} projects</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>by {project.team}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4" />
                          <span>{project.votes}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {project.members} members
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <Play className="h-3 w-3 mr-1" />
                              Demo
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sponsors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Sponsors</CardTitle>
                  <CardDescription>Thank you to our amazing sponsors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {event.sponsors.map((sponsor, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">{sponsor.name}</span>
                        </div>
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {sponsor.tier} Sponsor
                          </Badge>
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