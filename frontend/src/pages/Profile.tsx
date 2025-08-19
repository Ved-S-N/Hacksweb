import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Calendar, 
  Users, 
  Code, 
  Star, 
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Edit,
  Award,
  Target,
  TrendingUp
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const isOwnProfile = !id; // If no ID, it's the current user's profile
  
  // Mock user data
  const user = {
    id: id || "current-user",
    name: "John Developer",
    username: "johndev",
    avatar: "/placeholder-avatar.png",
    bio: "Full-stack developer passionate about AI and open source. Love building innovative solutions that make a difference.",
    location: "San Francisco, CA",
    joinDate: "2023-01-15",
    website: "https://johndev.io",
    github: "https://github.com/johndev",
    linkedin: "https://linkedin.com/in/johndev",
    twitter: "https://twitter.com/johndev",
    skills: ["React", "TypeScript", "Python", "AI/ML", "Node.js", "GraphQL"],
    stats: {
      eventsJoined: 12,
      projectsSubmitted: 8,
      prizesWon: 3,
      totalEarnings: 2500,
      averageRank: 4.2,
      successRate: 75
    }
  };

  const events = [
    {
      id: "1",
      title: "AI Innovation Challenge",
      date: "2024-03-15",
      status: "upcoming",
      role: "participant",
      team: "CodeCrafters",
      rank: null
    },
    {
      id: "2",
      title: "Green Tech Hackathon",
      date: "2024-02-20",
      status: "completed",
      role: "participant",
      team: "EcoBuilders",
      rank: 3,
      prize: 1000
    },
    {
      id: "3",
      title: "Web3 Future Hack",
      date: "2024-01-10",
      status: "completed",
      role: "participant",
      team: "BlockBuilders",
      rank: 1,
      prize: 1500
    }
  ];

  const projects = [
    {
      id: "1",
      title: "Smart Agriculture Platform",
      description: "IoT-based platform for precision farming using AI and sensor data",
      event: "Green Tech Hackathon",
      technologies: ["React", "Python", "TensorFlow", "IoT"],
      github: "https://github.com/johndev/smart-farm",
      demo: "https://demo.smartfarm.io",
      rank: 3,
      votes: 127,
      date: "2024-02-22"
    },
    {
      id: "2",
      title: "DeFi Analytics Dashboard",
      description: "Real-time analytics and portfolio tracking for DeFi investments",
      event: "Web3 Future Hack",
      technologies: ["Vue.js", "Web3.js", "Solidity", "Chart.js"],
      github: "https://github.com/johndev/defi-analytics",
      demo: "https://demo.defianalytics.com",
      rank: 1,
      votes: 234,
      date: "2024-01-12"
    }
  ];

  const achievements = [
    { 
      title: "First Place Winner", 
      description: "Won 1st place in Web3 Future Hack", 
      date: "2024-01-12",
      icon: Trophy,
      color: "text-yellow-500"
    },
    { 
      title: "Top Performer", 
      description: "Ranked in top 5 across 3 consecutive events", 
      date: "2024-02-22",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    { 
      title: "Team Player", 
      description: "Participated in 10+ team events", 
      date: "2024-02-01",
      icon: Users,
      color: "text-green-500"
    },
    { 
      title: "Code Master", 
      description: "Submitted 5+ high-quality projects", 
      date: "2024-01-15",
      icon: Code,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-primary/5 to-primary-hover/5 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar and Basic Info */}
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* User Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {isOwnProfile && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                <p className="text-lg text-muted-foreground">@{user.username}</p>
              </div>
              
              <p className="text-muted-foreground max-w-2xl">{user.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={user.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={user.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              </div>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.eventsJoined}</div>
                <div className="text-sm text-muted-foreground">Events Joined</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.projectsSubmitted}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning">{user.stats.prizesWon}</div>
                <div className="text-sm text-muted-foreground">Prizes Won</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">${user.stats.totalEarnings}</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.averageRank}</div>
                <div className="text-sm text-muted-foreground">Avg Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-8">
        <div className="container">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{user.name}</span> registered for{" "}
                            <span className="font-medium">AI Innovation Challenge</span>
                          </p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{user.name}</span> won 3rd place in{" "}
                            <span className="font-medium">Green Tech Hackathon</span>
                          </p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Project Quality Score</span>
                          <span>8.5/10</span>
                        </div>
                        <Progress value={85} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Team Collaboration</span>
                          <span>9.2/10</span>
                        </div>
                        <Progress value={92} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Technical Innovation</span>
                          <span>7.8/10</span>
                        </div>
                        <Progress value={78} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Latest Achievements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full bg-muted ${achievement.color}`}>
                            <achievement.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{achievement.title}</div>
                            <div className="text-xs text-muted-foreground">{achievement.description}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Event Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upcoming events will appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event History</CardTitle>
                  <CardDescription>All events {user.name} has participated in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Team: {event.team}</span>
                            <span>•</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            {event.rank && (
                              <>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Rank #{event.rank}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={event.status === "upcoming" ? "secondary" : "default"}>
                            {event.status}
                          </Badge>
                          {event.prize && (
                            <Badge className="bg-success text-success-foreground">
                              ${event.prize}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>for {project.event}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 text-warning" />
                          <span>{project.votes}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-warning" />
                          <span className="text-sm font-medium">Rank #{project.rank}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3 w-3 mr-1" />
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

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full bg-muted ${achievement.color}`}>
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;