import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/courseService";
import { toast } from "sonner";

// Define course types
export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isSubmitted: boolean;
  courseName: string;
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  recurrenceEndDate?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  dateAdded: string;
  fileUrl?: string;
};

export type Grade = {
  id: string;
  title: string;
  percentage: number;
  weight: number;
};

export type Course = {
  id: string;
  name: string;
  instructor: string;
  description: string;
  code: string; 
  schedule: string;
  color?: string;
  assignments: Assignment[];
  notes: Note[];
  grades: Grade[];
};

// Context type
type CourseContextType = {
  courses: Course[];
  assignments: Assignment[];
  isLoading: boolean;
  isError: boolean;
  getCourse: (id: string) => Course | undefined;
  addAssignment: (courseId: string, assignment: Omit<Assignment, "id" | "courseName" | "isRecurring" | "recurrencePattern" | "recurrenceEndDate"> & { isRecurring?: boolean, recurrencePattern?: 'daily' | 'weekly' | 'monthly', recurrenceEndDate?: string }) => void;
  updateAssignment: (assignment: Assignment) => void;
  toggleAssignmentStatus: (courseId: string, assignmentId: string) => void;
  addNote: (courseId: string, note: Omit<Note, "id" | "dateAdded">) => void;
  addCourse: (course: Omit<Course, "id" | "assignments" | "notes" | "grades">) => void;
  addGrade: (courseId: string, grade: Omit<Grade, "id">) => void;
  // New functions for editing and removing items
  deleteCourse: (courseId: string) => void;
  updateCourse: (updatedCourse: Course) => void;
  deleteAssignment: (assignmentId: string) => void;
  deleteNote: (courseId: string, noteId: string) => void;
  updateNote: (courseId: string, updatedNote: Note) => void;
  deleteGrade: (courseId: string, gradeId: string) => void;
  updateGrade: (courseId: string, updatedGrade: Grade) => void;
};

// Create context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Context provider component
export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Fetch courses from the API
  const { 
    data: courses = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses
  });

  // Create mutations for CRUD operations
  const createCourseMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course added successfully");
    },
    onError: (error) => {
      console.error("Error creating course:", error);
      toast.error("Failed to add course");
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: (course: Course) => courseService.updateCourse(course.id, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course updated successfully");
    },
    onError: (error) => {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  });

  const addAssignmentMutation = useMutation({
    mutationFn: ({ courseId, assignment }: { courseId: string, assignment: any }) => 
      courseService.addAssignment(courseId, assignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Assignment added successfully");
    },
    onError: (error) => {
      console.error("Error adding assignment:", error);
      toast.error("Failed to add assignment");
    }
  });

  const toggleAssignmentMutation = useMutation({
    mutationFn: ({ courseId, assignmentId }: { courseId: string, assignmentId: string }) => 
      courseService.toggleAssignmentStatus(courseId, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      console.error("Error toggling assignment status:", error);
      toast.error("Failed to update assignment");
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ courseId, note }: { courseId: string, note: Omit<Note, "id" | "dateAdded"> }) => 
      courseService.addNote(courseId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Note added successfully");
    },
    onError: (error) => {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  });

  const addGradeMutation = useMutation({
    mutationFn: ({ courseId, grade }: { courseId: string, grade: Omit<Grade, "id"> }) => 
      courseService.addGrade(courseId, grade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Grade added successfully");
    },
    onError: (error) => {
      console.error("Error adding grade:", error);
      toast.error("Failed to add grade");
    }
  });

  // Calculate all assignments across courses
  const assignments = courses?.flatMap(course => 
    course.assignments.map(assignment => ({
      ...assignment,
      courseName: course.name
    }))
  ) || [];

  // Get a specific course by ID
  const getCourse = (id: string) => {
    return courses?.find(course => course.id === id);
  };

  // Add a new assignment to a course
  const addAssignment = (courseId: string, assignment: Omit<Assignment, "id" | "courseName" | "isRecurring" | "recurrencePattern" | "recurrenceEndDate"> & { isRecurring?: boolean, recurrencePattern?: 'daily' | 'weekly' | 'monthly', recurrenceEndDate?: string }) => {
    const { isRecurring = false, recurrencePattern, recurrenceEndDate, ...restAssignment } = assignment;
    
    addAssignmentMutation.mutate({
      courseId,
      assignment: {
        ...restAssignment,
        isRecurring,
        recurrencePattern,
        recurrenceEndDate
      }
    });
  };

  // Update an existing assignment (not implemented in API yet)
  const updateAssignment = (updatedAssignment: Assignment) => {
    // This would need a backend endpoint
    toast.error("Update assignment functionality is not implemented in the API yet");
  };

  // Delete an assignment (not implemented in API yet)
  const deleteAssignment = (assignmentId: string) => {
    // This would need a backend endpoint
    toast.error("Delete assignment functionality is not implemented in the API yet");
  };

  // Toggle assignment submission status
  const toggleAssignmentStatus = (courseId: string, assignmentId: string) => {
    toggleAssignmentMutation.mutate({ courseId, assignmentId });
  };

  // Add a new note to a course
  const addNote = (courseId: string, note: Omit<Note, "id" | "dateAdded">) => {
    addNoteMutation.mutate({ courseId, note });
  };

  // Delete a note (not implemented in API yet)
  const deleteNote = (courseId: string, noteId: string) => {
    // This would need a backend endpoint
    toast.error("Delete note functionality is not implemented in the API yet");
  };

  // Update a note (not implemented in API yet)
  const updateNote = (courseId: string, updatedNote: Note) => {
    // This would need a backend endpoint
    toast.error("Update note functionality is not implemented in the API yet");
  };

  // Add a new course
  const addCourse = (courseData: Omit<Course, "id" | "assignments" | "notes" | "grades">) => {
    createCourseMutation.mutate(courseData);
  };

  // Delete a course
  const deleteCourse = (courseId: string) => {
    deleteCourseMutation.mutate(courseId);
  };

  // Update a course
  const updateCourse = (updatedCourse: Course) => {
    updateCourseMutation.mutate(updatedCourse);
  };

  // Add a new grade to a course
  const addGrade = (courseId: string, grade: Omit<Grade, "id">) => {
    addGradeMutation.mutate({ 
      courseId, 
      grade: {
        ...grade
      }
    });
  };

  // Delete a grade (not implemented in API yet)
  const deleteGrade = (courseId: string, gradeId: string) => {
    // This would need a backend endpoint
    toast.error("Delete grade functionality is not implemented in the API yet");
  };

  // Update a grade (not implemented in API yet)
  const updateGrade = (courseId: string, updatedGrade: Grade) => {
    // This would need a backend endpoint
    toast.error("Update grade functionality is not implemented in the API yet");
  };

  const value = {
    courses,
    assignments,
    isLoading,
    isError,
    getCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentStatus,
    addNote,
    deleteNote,
    updateNote,
    addCourse,
    deleteCourse,
    updateCourse,
    addGrade,
    deleteGrade,
    updateGrade
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

// Custom hook to use the course context
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
