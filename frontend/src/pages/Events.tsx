import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/ui/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search } from "lucide-react";

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "AI Innovation Challenge 2024",
    description:
      "Build the next generation of AI applications that solve real-world problems. Open to all skill levels.",
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
    description:
      "Explore the future of decentralized applications and blockchain technology.",
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
    description:
      "Create sustainable technology solutions for environmental challenges.",
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
  {
    id: "4",
    title: "Roboticss and AI/ML",
    description:
      "Build the next generation of AI robots that solve real-world problems. Open to all skill levels.",
    startDate: "2025-08-15",
    endDate: "2025-09-17",
    location: "Mumbai, Maharashtra",
    isOnline: true,
    totalPrize: 500000,
    participants: 6900,
    maxParticipants: 8000,
    status: "upcoming" as const,
    tags: ["AI", "Machine Learning", "Innovation"],
    organizer: {
      name: "TMKC",
      avatar: "/placeholder-avatar.png",
    },
  },
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("❌ Failed to fetch listings:", err);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const eventTagsArray = event.tags ? event.tags.split(",") : [];

    const matchesCategory =
      selectedCategory === "all" ||
      eventTagsArray.some((tag: string) =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      );

    const matchesTab = activeTab === "all" || event.status === activeTab;

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16">
        <div className="container">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Discover Amazing Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers, designers, and innovators in
              exciting hackathons and competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ai">AI & ML</SelectItem>
                  <SelectItem value="web3">Web3 & Blockchain</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="game">Game Development</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-8">
        <div className="container">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Live</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {filteredEvents.length} events found
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Most Recent</Badge>
                  <Badge variant="outline">Popular</Badge>
                  <Badge variant="outline">Prize Amount</Badge>
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  // Convert tags string to array if needed
                  const eventTagsArray = event.tags
                    ? event.tags.split(",")
                    : [];
                  return (
                    <EventCard
                      key={event.id}
                      {...event}
                      tags={eventTagsArray}
                    />
                  );
                })}
              </div>

              {/* Load More */}
              {filteredEvents.length > 0 && (
                <div className="text-center pt-8">
                  <Button variant="outline" size="lg">
                    Load More Events
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">
                    No events found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse all events.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setActiveTab("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
