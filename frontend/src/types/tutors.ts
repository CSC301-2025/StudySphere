
export interface TutorPosting {
  id: string;
  tutorId: string;
  title: string;
  coursesTaught: string[];
  description: string;
  location: "online" | "in-person" | "both";
  pricePerHour: number;
  contactEmail: string;
  university?: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  university?: string;
  bio: string;
  expertise: string[];
  createdAt: string;
}

export interface TutorFilter {
  university?: string;
  courses?: string[];
  location?: "online" | "in-person" | "both" | "all";
  priceRange?: {
    min?: number;
    max?: number;
  };
}
