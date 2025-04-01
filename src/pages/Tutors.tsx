
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tutorService } from "@/services/tutorService";
import { TutorFilter } from "@/types/tutors";
import TutorFilterForm from "@/components/TutorFilterForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import TutorListing from "@/components/TutorListing";
import TutorProfileCreation from "@/components/TutorProfileCreation";

const Tutors = () => {
  const [activeTab, setActiveTab] = useState<string>("browse");
  const [filters, setFilters] = useState<TutorFilter>({
    location: "all",
    priceRange: { min: 0, max: 100 }
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch all tutors
  const { data: allTutors, isLoading, isError, refetch } = useQuery({
    queryKey: ["tutors"],
    queryFn: tutorService.getAllTutorPostings,
  });

  // Fetch filtered tutors when filters change
  const { data: filteredTutors, isLoading: isFilterLoading, refetch: refetchFiltered } = useQuery({
    queryKey: ["tutors", "filtered", filters],
    queryFn: () => tutorService.filterTutorPostings(filters),
    enabled: !!filters && (filters.location !== "all" || 
      filters.university !== undefined || 
      filters.courses !== undefined || 
      (filters.priceRange?.min !== 0 || filters.priceRange?.max !== 100)),
  });

  // Use either filtered results or all tutors
  const tutorsToDisplay = filteredTutors || allTutors;

  // Fetch current user's tutor profile if they have one
  const { 
    data: tutorProfile, 
    isLoading: isProfileLoading,
    refetch: refetchProfile 
  } = useQuery({
    queryKey: ["tutorProfile", user?.id],
    queryFn: () => tutorService.getTutorProfileByUserId(user?.id || ""),
    enabled: !!user?.id,
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: TutorFilter) => {
    console.log("Applying filters:", newFilters);
    setFilters(newFilters);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({
      location: "all",
      priceRange: { min: 0, max: 100 }
    });
  };

  // Handle profile creation
  const handleCreateProfile = async (profileData: Omit<TutorProfile, "id" | "createdAt">) => {
    try {
      await tutorService.createTutorProfile(profileData);
      toast({
        title: "Profile Created",
        description: "Your tutor profile has been created successfully.",
      });
      
      // Refetch profile data
      await refetchProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tutor profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handle tutor posting creation
  const handleCreatePosting = async (postingData: Omit<TutorPosting, "id">) => {
    try {
      await tutorService.createTutorPosting(postingData);
      
      toast({
        title: "Posting Created",
        description: "Your tutor posting has been created successfully.",
      });
      
      // Refetch data to include the new posting
      await refetch();
      await refetchFiltered();
      
      // Switch to browse tab to see the new posting
      setActiveTab("browse");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tutor posting",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Find Tutors</h1>
          <div className="flex space-x-2">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Filters</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <TutorFilterForm 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onClose={() => setFilterOpen(false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Tutors</TabsTrigger>
            <TabsTrigger value="create">Become a Tutor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>Available Tutors</CardTitle>
                <CardDescription>
                  Find tutors for your courses. You can filter by university, courses, location, and price.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TutorListing 
                  tutors={tutorsToDisplay}
                  isLoading={isLoading || isFilterLoading}
                  isError={isError}
                  onClearFilters={handleClearFilters}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>
                  {!tutorProfile ? "Create Your Tutor Profile" : "Create a Tutor Posting"}
                </CardTitle>
                <CardDescription>
                  {!tutorProfile 
                    ? "Before creating a posting, you need to set up your tutor profile." 
                    : "Share your expertise with others by creating a tutor posting."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TutorProfileCreation
                  tutorProfile={tutorProfile}
                  isProfileLoading={isProfileLoading}
                  onCreateProfile={handleCreateProfile}
                  onCreatePosting={handleCreatePosting}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

import { TutorPosting, TutorProfile } from "@/types/tutors";
export default Tutors;
