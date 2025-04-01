
import React from "react";
import { TutorPosting } from "@/types/tutors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MapPin, Globe, DollarSign, Mail, User, BookOpen, School } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutorProfileProps {
  tutor: TutorPosting;
}

const TutorProfile: React.FC<TutorProfileProps> = ({ tutor }) => {
  const { toast } = useToast();

  const handleContactCopy = () => {
    navigator.clipboard.writeText(tutor.contactEmail);
    toast({
      title: "Email Copied",
      description: "The tutor's email has been copied to your clipboard.",
    });
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <div className="flex justify-between items-start">
          <DialogTitle className="text-2xl font-bold">{tutor.title}</DialogTitle>
          <Badge variant={tutor.location === "online" ? "outline" : "secondary"} className="ml-2">
            {tutor.location === "online" ? (
              <Globe className="w-3 h-3 mr-1" />
            ) : tutor.location === "both" ? (
              "Online & In Person"
            ) : (
              <MapPin className="w-3 h-3 mr-1" />
            )}
            {tutor.location === "online" ? "Online" : tutor.location === "both" ? "" : "In Person"}
          </Badge>
        </div>
        <DialogDescription className="flex items-center gap-1 mt-1">
          <School className="h-3 w-3" />
          {tutor.university || "Not specified"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Pricing */}
        <div className="flex items-center text-lg font-medium">
          <DollarSign className="h-5 w-5 mr-2 text-primary" />
          <span>${tutor.pricePerHour}/hour</span>
        </div>

        <Separator />

        {/* About Section */}
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            About this Tutor
          </h3>
          <p className="text-muted-foreground">
            {tutor.description}
          </p>
        </div>

        <Separator />

        {/* Courses */}
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </h3>
          <div className="flex flex-wrap gap-2">
            {tutor.coursesTaught.map((course, index) => (
              <Badge key={index} variant="secondary">
                {course}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </h3>
          <div className="flex items-center">
            <p className="text-muted-foreground">{tutor.contactEmail}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleContactCopy}
              className="ml-2"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default TutorProfile;
