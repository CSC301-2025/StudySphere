// src/services/tutorService.ts
import axios from "axios";
import axiosClient from "@/lib/axiosClient";
import { TutorPosting, TutorFilter, TutorProfile } from "@/types/tutors";

// API base URL segment for tutor endpoints
const API_BASE_URL = "/Tutor";

interface ApiError {
  message: string;
  status: number;
}

export const tutorService = {
  // Get all tutor postings
  getAllTutorPostings: async (): Promise<TutorPosting[]> => {
    try {
      const response = await axiosClient.get<TutorPosting[]>(`${API_BASE_URL}/posting`);
      console.log("Fetched tutor postings:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching tutor postings:", error);
      return [];
    }
  },

  // Filter tutor postings
  filterTutorPostings: async (filter: TutorFilter): Promise<TutorPosting[]> => {
    try {
      console.log("Filtering with:", filter);
      const response = await axiosClient.post<TutorPosting[]>(`${API_BASE_URL}/posting/filter`, filter);
      console.log("Filtered results:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error filtering tutor postings:", error);
      return [];
    }
  },

  // Create new tutor posting
  createTutorPosting: async (
    postingData: Omit<TutorPosting, "id">
  ): Promise<TutorPosting> => {
    try {
      const response = await axiosClient.post<TutorPosting>(`${API_BASE_URL}/posting`, postingData);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || "Failed to create tutor posting",
        status: error.response?.status || 500,
      };

      if (error.response?.status === 400) {
        throw new Error("You must create a tutor profile before creating a posting");
      }

      throw new Error(apiError.message);
    }
  },

  // Get tutor posting by ID
  getTutorPostingById: async (id: string): Promise<TutorPosting | null> => {
    try {
      const response = await axiosClient.get<TutorPosting>(`${API_BASE_URL}/posting/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tutor posting with ID ${id}:`, error);
      return null;
    }
  },

  // Create a tutor profile
  createTutorProfile: async (
    profileData: Omit<TutorProfile, "id" | "createdAt">
  ): Promise<TutorProfile> => {
    try {
      const response = await axiosClient.post<TutorProfile>(`${API_BASE_URL}/profile`, profileData);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || "Failed to create tutor profile",
        status: error.response?.status || 500,
      };

      if (error.response?.status === 409) {
        throw new Error("You already have a tutor profile");
      }

      throw new Error(apiError.message);
    }
  },

  // Get tutor profile by user ID
  getTutorProfileByUserId: async (userId: string): Promise<TutorProfile | null> => {
    try {
      // For current user, use the /profile endpoint without userId
      const endpoint = userId ? `/profile/${userId}` : "/profile";
      const response = await axiosClient.get<TutorProfile>(`${API_BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      if ((error as any).isAxiosError && error.response?.status !== 404) {
        console.error("Error fetching tutor profile:", error);
      }
      return null;
    }
  },

  // Update tutor profile
  updateTutorProfile: async (
    profileData: Partial<TutorProfile>
  ): Promise<TutorProfile> => {
    try {
      const response = await axiosClient.patch<TutorProfile>(`${API_BASE_URL}/profile`, profileData);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || "Failed to update tutor profile",
        status: error.response?.status || 500,
      };
      throw new Error(apiError.message);
    }
  },
};
