import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/ui/event-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Code, 
  Users, 
  Trophy, 
  Zap, 
  Globe, 
  Shield, 
  ArrowRight,
  Star,
  Calendar,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Featured events mock data
  const featuredEvents = [
    {
      id: "1",
      title: "AI Innovation Challenge 2024",
      description: "Build the next generation of AI applications that solve real-world problems.",
      startDate: "2024-03-15",
      endDate: "2024-03-17",
      location: "San Francisco, CA",
      isOnline: false,
      totalPrize: 50000,
      participants: 1250,
      maxParticipants: 2000,
      status: "upcoming" as const,
      tags: ["AI", "Machine Learning", "Innovation"],
      organizer: {
        name: "TechCorp",
        avatar: "/placeholder-avatar.png",
      },
    },
    {
      id: "2",
      title: "Web3 Future Hack",
      description: "Explore the future of decentralized applications and blockchain technology.",
      startDate: "2024-03-01",
      endDate: "2024-03-03",
      location: "Virtual Event",
      isOnline: true,
      totalPrize: 25000,
      participants: 890,
      maxParticipants: 1500,
      status: "ongoing" as const,
      tags: ["Web3", "Blockchain", "DeFi"],
      organizer: {
        name: "BlockChain Labs",
        avatar: "/placeholder-avatar.png",
      },
    },
    {
      id: "3",
      title: "Green Tech Hackathon",
      description: "Create sustainable technology solutions for environmental challenges.",
      startDate: "2024-02-20",
      endDate: "2024-02-22",
      location: "Austin, TX",
      isOnline: false,
      totalPrize: 30000,
      participants: 650,
      maxParticipants: 1000,
      status: "ended" as const,
      tags: ["Sustainability", "CleanTech", "Environment"],
      organizer: {
        name: "GreenTech Foundation",
        avatar: "/placeholder-avatar.png",
      },
    },
  ];

  const stats = [
    { label: "Active Events", value: "150+", icon: Calendar },
    { label: "Total Participants", value: "50K+", icon: Users },
    { label: "Prize Pool", value: "$2M+", icon: Trophy },
    { label: "Success Rate", value: "95%", icon: Target },
  ];

  const features = [
    {
      icon: Code,
      title: "Easy Event Creation",
      description: "Create and manage hackathons with our intuitive event builder.",
    },
    {
      icon: Users,
      title: "Team Formation",
      description: "Find teammates and collaborate seamlessly with built-in tools.",
    },
    {
      icon: Trophy,
      title: "Fair Judging",
      description: "Transparent scoring system with real-time feedback.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay informed with live announcements and notifications.",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with developers and innovators worldwide.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for your projects and data.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary-hover/5 py-20 md:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              🚀 Join 50,000+ developers worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Host Amazing{" "}
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Hackathons
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate platform for hosting and participating in hackathons, 
              coding competitions, and innovation challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/events">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/create-event">
                  Host Event
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most exciting hackathons and competitions happening right now.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features to make your hackathon experience seamless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Building?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of developers and innovators in the next generation 
                of hackathons. Create, collaborate, and compete.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                  <Link to="/register">
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 hover:bg-white/10" asChild>
                  <Link to="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
