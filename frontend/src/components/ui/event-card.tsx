import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  totalPrize: number;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "ongoing" | "ended";
  tags: string[];
  organizer: {
    name: string;
    avatar?: string;
  };
  banner?: string;
}

export const EventCard = ({
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  isOnline,
  totalPrize,
  participants,
  maxParticipants,
  status,
  tags,
  organizer,
  banner,
}: EventCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "ongoing":
        return <Badge className="bg-success text-success-foreground">Live</Badge>;
      case "ended":
        return <Badge variant="outline">Ended</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {banner ? (
          <img src={banner} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-hover/20" />
        )}
        <div className="absolute top-4 left-4">
          {getStatusBadge()}
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <Trophy className="h-3 w-3 mr-1" />
            ${totalPrize.toLocaleString()}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Event Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{isOnline ? "Online" : location}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{participants.toLocaleString()} participants</span>
          </div>
          <div className="text-muted-foreground">
            {maxParticipants && (
              <span>{Math.round((participants / maxParticipants) * 100)}% full</span>
            )}
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={organizer.avatar} alt={organizer.name} />
            <AvatarFallback className="text-xs">
              {organizer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            by {organizer.name}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full space-x-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/event/${id}`}>
              View Details
            </Link>
          </Button>
          {status === "upcoming" && (
            <Button asChild className="flex-1">
              <Link to={`/event/${id}/register`}>
                Register
              </Link>
            </Button>
          )}
          {status === "ongoing" && (
            <Button asChild className="flex-1 bg-success hover:bg-success/90">
              <Link to={`/event/${id}/submit`}>
                Submit Project
              </Link>
            </Button>
          )}
          {status === "ended" && (
            <Button asChild variant="outline" className="flex-1">
              <Link to={`/event/${id}/results`}>
                View Results
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};