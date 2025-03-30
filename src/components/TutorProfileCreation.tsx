
import React from "react";
import { TutorProfile } from "@/types/tutors";
import TutorProfileForm from "@/components/TutorProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TutorProfileCreationProps {
  tutorProfile: TutorProfile | null | undefined;
  isProfileLoading: boolean;
  onCreateProfile: (profileData: Omit<TutorProfile, "id" | "createdAt">) => Promise<void>;
  onCreatePosting: (postingData: any) => Promise<void>;
}

const TutorProfileCreation: React.FC<TutorProfileCreationProps> = ({
  tutorProfile,
  isProfileLoading,
  onCreateProfile,
  onCreatePosting
}) => {
  if (isProfileLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse">Loading profile data...</div>
      </div>
    );
  }

  if (!tutorProfile) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to create a tutor profile before you can create postings.
          </AlertDescription>
        </Alert>
        <TutorProfileForm onSubmit={onCreateProfile} />
      </div>
    );
  }

  return <CreateTutorPostingForm onSubmit={onCreatePosting} />;
};

import CreateTutorPostingForm from "@/components/CreateTutorPostingForm";

export default TutorProfileCreation;
