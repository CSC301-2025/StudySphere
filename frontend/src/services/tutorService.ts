
import { TutorPosting, TutorFilter, TutorProfile } from "@/types/tutors";
import { v4 as uuidv4 } from "uuid";

// Mock data for tutor profiles
let mockTutorProfiles: TutorProfile[] = [];

// Mock data for tutor postings
let mockTutorPostings: TutorPosting[] = [
  {
    id: "1",
    tutorId: "user1",
    title: "Experienced Math Tutor",
    coursesTaught: ["Calculus I", "Calculus II", "Linear Algebra"],
    description: "I am a mathematics graduate with 5 years of tutoring experience. I specialize in calculus and linear algebra, and have helped many students improve their grades and understanding of complex mathematical concepts.",
    location: "online",
    pricePerHour: 35,
    contactEmail: "math.tutor@example.com",
    university: "University of Toronto",
  },
  {
    id: "2",
    tutorId: "user2",
    title: "Physics Tutor for All Levels",
    coursesTaught: ["Physics 101", "Mechanics", "Electromagnetism", "Quantum Physics"],
    description: "Physics PhD student offering tutoring services for undergraduate and high school students. I can help with conceptual understanding, problem-solving techniques, and exam preparation. My teaching approach focuses on building intuition for physical phenomena.",
    location: "in-person",
    pricePerHour: 40,
    contactEmail: "physics.tutor@example.com",
    university: "University of British Columbia",
  },
  {
    id: "3",
    tutorId: "user3",
    title: "Computer Science Tutor",
    coursesTaught: ["Introduction to Programming", "Data Structures", "Algorithms", "Web Development"],
    description: "Software engineer with expertise in multiple programming languages including Python, Java, and JavaScript. I can help with programming assignments, algorithm design, and project development. My approach is hands-on, focusing on practical coding skills.",
    location: "both",
    pricePerHour: 45,
    contactEmail: "cs.tutor@example.com",
    university: "McGill University",
  },
];

// Simulate delay for API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const tutorService = {
  // Get all tutor postings
  getAllTutorPostings: async (): Promise<TutorPosting[]> => {
    await delay(800); // Simulate network delay
    return [...mockTutorPostings];
  },

  // Filter tutor postings
  filterTutorPostings: async (filter: TutorFilter): Promise<TutorPosting[]> => {
    await delay(600); // Simulate network delay
    let filteredTutors = [...mockTutorPostings];

    // Filter by university
    if (filter.university) {
      filteredTutors = filteredTutors.filter(
        (tutor) => tutor.university === filter.university
      );
    }

    // Filter by courses
    if (filter.courses && filter.courses.length > 0) {
      filteredTutors = filteredTutors.filter((tutor) =>
        filter.courses!.some((course) =>
          tutor.coursesTaught.some((tutorCourse) =>
            tutorCourse.toLowerCase().includes(course.toLowerCase())
          )
        )
      );
    }

    // Filter by location
    if (filter.location && filter.location !== "all") {
      filteredTutors = filteredTutors.filter(
        (tutor) => tutor.location === filter.location || 
                  (tutor.location === "both" && 
                   (filter.location === "online" || filter.location === "in-person"))
      );
    }

    // Filter by price range
    if (filter.priceRange) {
      if (filter.priceRange.min !== undefined) {
        filteredTutors = filteredTutors.filter(
          (tutor) => tutor.pricePerHour >= (filter.priceRange?.min || 0)
        );
      }
      if (filter.priceRange.max !== undefined) {
        filteredTutors = filteredTutors.filter(
          (tutor) => tutor.pricePerHour <= (filter.priceRange?.max || Infinity)
        );
      }
    }

    return filteredTutors;
  },

  // Create new tutor posting
  createTutorPosting: async (
    postingData: Omit<TutorPosting, "id">
  ): Promise<TutorPosting> => {
    await delay(1000); // Simulate network delay
    
    // Get user's profile to verify they have one
    const userProfile = await tutorService.getTutorProfileByUserId(postingData.tutorId);
    
    if (!userProfile) {
      throw new Error("You must create a tutor profile before creating a posting");
    }

    const newPosting: TutorPosting = {
      id: uuidv4(),
      ...postingData,
    };

    mockTutorPostings.push(newPosting);
    return newPosting;
  },

  // Get tutor posting by ID
  getTutorPostingById: async (id: string): Promise<TutorPosting | null> => {
    await delay(500); // Simulate network delay
    const posting = mockTutorPostings.find((p) => p.id === id);
    return posting || null;
  },

  // Create a tutor profile
  createTutorProfile: async (profileData: Omit<TutorProfile, "id" | "createdAt">): Promise<TutorProfile> => {
    await delay(1000); // Simulate network delay
    
    // Check if user already has a profile
    const existingProfile = mockTutorProfiles.find(p => p.userId === profileData.userId);
    if (existingProfile) {
      throw new Error("You already have a tutor profile");
    }
    
    const newProfile: TutorProfile = {
      id: uuidv4(),
      ...profileData,
      createdAt: new Date().toISOString()
    };
    
    mockTutorProfiles.push(newProfile);
    return newProfile;
  },
  
  // Get tutor profile by user ID
  getTutorProfileByUserId: async (userId: string): Promise<TutorProfile | null> => {
    await delay(500); // Simulate network delay
    const profile = mockTutorProfiles.find(p => p.userId === userId);
    return profile || null;
  },
  
  // Update tutor profile
  updateTutorProfile: async (id: string, profileData: Partial<TutorProfile>): Promise<TutorProfile> => {
    await delay(800); // Simulate network delay
    
    const profileIndex = mockTutorProfiles.findIndex(p => p.id === id);
    if (profileIndex === -1) {
      throw new Error("Profile not found");
    }
    
    const updatedProfile = {
      ...mockTutorProfiles[profileIndex],
      ...profileData
    };
    
    mockTutorProfiles[profileIndex] = updatedProfile;
    return updatedProfile;
  }
};
