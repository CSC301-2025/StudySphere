
import React from "react";
import { TutorPosting } from "@/types/tutors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Globe, DollarSign, Mail } from "lucide-react";
import TutorProfile from "./TutorProfile";

interface TutorCardProps {
  tutor: TutorPosting;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <Dialog>
      <Card className="h-full flex flex-col cursor-pointer hover:border-primary transition-colors duration-200">
        <DialogTrigger className="h-full flex flex-col text-left">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{tutor.title}</CardTitle>
              <Badge variant={tutor.location === "online" ? "outline" : "secondary"}>
                {tutor.location === "online" ? (
                  <Globe className="w-3 h-3 mr-1" />
                ) : (
                  <MapPin className="w-3 h-3 mr-1" />
                )}
                {tutor.location === "online" ? "Online" : "In Person"}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {tutor.university || "Not specified"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Courses Taught</h4>
                <div className="flex flex-wrap gap-1">
                  {tutor.coursesTaught.map((course, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">About</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {tutor.description}
                </p>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">${tutor.pricePerHour}/hour</span>
              </div>
            </div>
          </CardContent>
        </DialogTrigger>
        <CardFooter className="border-t pt-4">
          <DialogTrigger className="w-full">
            <Button className="w-full" variant="default">
              <Mail className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
      
      <TutorProfile tutor={tutor} />
    </Dialog>
  );
};

export default TutorCard;
