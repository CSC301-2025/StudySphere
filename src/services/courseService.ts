import axiosClient from "@/lib/axiosClient";
import { Course, Note, Assignment, Grade } from "@/context/CourseContext";
import { toast } from "sonner";

export const courseService = {
  // Get all courses for the current user with improved error handling
  getAllCourses: async (): Promise<Course[]> => {
    try {
      // Add cache-busting parameter to ensure fresh data after sign-in
      const timestamp = new Date().getTime();
      const userId = localStorage.getItem("userId") || "anonymous";
      
      const response = await axiosClient.get(`/courses`, {
        params: {
          _t: timestamp,
          _uid: userId
        }
      });
      
      // Ensure we return an empty array instead of null or undefined
      if (!response.data) {
        console.warn('No course data received from API');
        return [];
      }
      
      // Validate and transform the response data
      return Array.isArray(response.data) 
        ? response.data.map(course => ({
            ...course,
            assignments: Array.isArray(course.assignments) ? course.assignments : [],
            notes: Array.isArray(course.notes) ? course.notes : [],
            grades: Array.isArray(course.grades) ? course.grades : []
          }))
        : [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  // Get a specific course by ID
  getCourseById: async (courseId: string): Promise<Course> => {
    try {
      const response = await axiosClient.get(`/courses/${courseId}`);
      // Ensure assignments, notes, and grades are arrays
      const course = response.data;
      if (course) {
        course.assignments = Array.isArray(course.assignments) ? course.assignments : [];
        course.notes = Array.isArray(course.notes) ? course.notes : [];
        course.grades = Array.isArray(course.grades) ? course.grades : [];
      }
      return course;
    } catch (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      throw error;
    }
  },

  // Create a new course
  createCourse: async (courseData: Omit<Course, "id" | "assignments" | "notes" | "grades">): Promise<Course> => {
    try {
      const response = await axiosClient.post('/courses', {
        ...courseData,
        assignments: [],
        notes: [],
        grades: []
      });
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update a course
  updateCourse: async (courseId: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await axiosClient.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${courseId}:`, error);
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (courseId: string): Promise<void> => {
    try {
      await axiosClient.delete(`/courses/${courseId}`);
    } catch (error) {
      console.error(`Error deleting course ${courseId}:`, error);
      throw error;
    }
  },

  // Add an assignment to a course - updated to ensure isSubmitted is included
  addAssignment: async (courseId: string, assignmentData: Omit<Assignment, "id" | "courseName">): Promise<Assignment> => {
    try {
      // Ensure isSubmitted is present in the data, default to false if not provided
      const dataWithSubmitStatus = {
        ...assignmentData,
        isSubmitted: assignmentData.isSubmitted !== undefined ? assignmentData.isSubmitted : false
      };
      
      const response = await axiosClient.post(`/courses/${courseId}/assignments`, dataWithSubmitStatus);
      return response.data;
    } catch (error) {
      console.error(`Error adding assignment to course ${courseId}:`, error);
      throw error;
    }
  },

  // Add a note to a course
  addNote: async (courseId: string, noteData: Omit<Note, "id" | "dateAdded">): Promise<Note> => {
    try {
      const response = await axiosClient.post(`/courses/${courseId}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error(`Error adding note to course ${courseId}:`, error);
      throw error;
    }
  },

  // Add a grade to a course
  addGrade: async (courseId: string, gradeData: Omit<Grade, "id">): Promise<Grade> => {
    try {
      const response = await axiosClient.post(`/courses/${courseId}/grades`, gradeData);
      return response.data;
    } catch (error) {
      console.error(`Error adding grade to course ${courseId}:`, error);
      throw error;
    }
  },

  // Toggle assignment status
  toggleAssignmentStatus: async (courseId: string, assignmentId: string): Promise<Assignment> => {
    try {
      const response = await axiosClient.patch(`/courses/${courseId}/assignments/${assignmentId}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling assignment ${assignmentId} status:`, error);
      throw error;
    }
  }
};
