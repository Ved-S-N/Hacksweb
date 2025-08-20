import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LiveSubmissionButtonProps {
  eventId: number;
  teamId: number;
  onSubmit: () => void;
}

const LiveSubmissionButton: React.FC<LiveSubmissionButtonProps> = ({
  eventId,
  teamId,
  onSubmit,
}) => {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkEventStatus();
    const interval = setInterval(checkEventStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [eventId]);

  const checkEventStatus = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const event = await response.json();
      setIsLive(event.isLive);
    } catch (error) {
      console.error("Error checking event status:", error);
    }
  };

  const handleLiveSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          eventId,
          teamId,
          userId: user?.id,
          submissionType: "live_submission",
        }),
      });

      if (response.ok) {
        toast.success("Submission created successfully!");
        setOpen(false);
        onSubmit();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create submission");
      }
    } catch (error) {
      toast.error("Error creating submission");
    } finally {
      setLoading(false);
    }
  };

  if (!isLive) {
    return (
      <Button disabled className="w-full">
        Event Not Live
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Submit Project (Live)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Live Project Submission</DialogTitle>
        </DialogHeader>
        <SubmissionForm
          onSubmit={handleLiveSubmit}
          loading={loading}
          isLive={true}
        />
      </DialogContent>
    </Dialog>
  );
};

const SubmissionForm: React.FC<{
  onSubmit: (data: any) => void;
  loading: boolean;
  isLive?: boolean;
}> = ({ onSubmit, loading, isLive = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    videoLink: "",
    files: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, files }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Project Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          GitHub Repository URL
        </label>
        <input
          type="url"
          value={formData.githubLink}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, githubLink: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md"
          placeholder="https://github.com/username/repository"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Video Demo URL</label>
        <input
          type="url"
          value={formData.videoLink}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, videoLink: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Upload Files</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md"
          accept=".pdf,.doc,.docx,.zip,.mp4,.mov,.avi"
        />
        <p className="text-sm text-gray-600 mt-1">
          Accepted: PDF, DOC, DOCX, ZIP, MP4, MOV, AVI (Max 100MB each)
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Project"}
      </Button>
    </form>
  );
};

export default LiveSubmissionButton;
