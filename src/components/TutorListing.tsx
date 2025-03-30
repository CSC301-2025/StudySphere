
import React from "react";
import { TutorPosting } from "@/types/tutors";
import TutorCard from "@/components/TutorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TutorListingProps {
  tutors: TutorPosting[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onClearFilters: () => void;
}

const TutorListing: React.FC<TutorListingProps> = ({ 
  tutors, 
  isLoading, 
  isError, 
  onClearFilters 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse">Loading tutors...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading tutors. Please try again later.
      </div>
    );
  }

  if (!tutors || tutors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">No tutors found with the current filters.</p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
};

export default TutorListing;
