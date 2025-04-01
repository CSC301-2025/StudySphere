
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

// Improved safe array helper to prevent flatMap errors
const safeArray = <T,>(arr: T[] | null | undefined): T[] => {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  return arr;
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

  // Fetch courses from the API with enhanced error handling
  const { 
    data: courses = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses,
    // Add default value if data is null/undefined
    select: (data) => Array.isArray(data) ? data : []
  });

  // Create mutations for CRUD operations with optimistic updates
  const createCourseMutation = useMutation({
    mutationFn: courseService.createCourse,
    onMutate: async (newCourse) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      
      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      
      // Create optimistic course
      const optimisticCourse: Course = {
        ...newCourse,
        id: `temp-${Date.now()}`,
        assignments: [],
        notes: [],
        grades: []
      } as Course;
      
      // Optimistically update to the new value
      queryClient.setQueryData(['courses'], [...safeArray(previousCourses), optimisticCourse]);
      
      // Return a context with the previous and new course
      return { previousCourses, optimisticCourse };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course added successfully");
    },
    onError: (error, _, context) => {
      // Roll back to the previous value if an error occurred
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      console.error("Error creating course:", error);
      toast.error("Failed to add course");
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: (course: Course) => courseService.updateCourse(course.id, course),
    onMutate: async (updatedCourse) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      
      // Update course in the list
      const updatedCourses = safeArray(previousCourses).map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      );
      
      queryClient.setQueryData(['courses'], updatedCourses);
      
      // Also update the individual course cache if it exists
      const previousCourse = queryClient.getQueryData(['course', updatedCourse.id]) as Course;
      if (previousCourse) {
        queryClient.setQueryData(['course', updatedCourse.id], updatedCourse);
      }
      
      return { previousCourses, previousCourse };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course updated successfully");
    },
    onError: (error, updatedCourse, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(['course', updatedCourse.id], context.previousCourse);
      }
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      
      // Filter out the deleted course
      const updatedCourses = safeArray(previousCourses).filter(course => course.id !== courseId);
      
      queryClient.setQueryData(['courses'], updatedCourses);
      
      return { previousCourses };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course deleted successfully");
    },
    onError: (error, _, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  });

  const addAssignmentMutation = useMutation({
    mutationFn: ({ courseId, assignment }: { courseId: string, assignment: any }) => 
      courseService.addAssignment(courseId, assignment),
    onMutate: async ({ courseId, assignment }) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      await queryClient.cancelQueries({ queryKey: ['course', courseId] });
      
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      const previousCourse = queryClient.getQueryData(['course', courseId]) as Course | undefined;
      
      // Create optimistic assignment
      const tempId = `temp-${Date.now()}`;
      const optimisticAssignment: Assignment = {
        ...assignment,
        id: tempId,
        courseName: previousCourses?.find(c => c.id === courseId)?.name || "",
        isSubmitted: false,
        isRecurring: assignment.isRecurring || false,
      };
      
      // Update courses list
      if (previousCourses) {
        const updatedCourses = safeArray(previousCourses).map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              assignments: [...safeArray(course.assignments), optimisticAssignment]
            };
          }
          return course;
        });
        
        queryClient.setQueryData(['courses'], updatedCourses);
      }
      
      // Update individual course if it's loaded
      if (previousCourse) {
        const updatedCourse = {
          ...previousCourse,
          assignments: [...safeArray(previousCourse.assignments), optimisticAssignment]
        };
        
        queryClient.setQueryData(['course', courseId], updatedCourse);
      }
      
      return { previousCourses, previousCourse, tempId };
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success("Assignment added successfully");
    },
    onError: (error, { courseId }, context) => {
      // Roll back to previous state
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(['course', courseId], context.previousCourse);
      }
      console.error("Error adding assignment:", error);
      toast.error("Failed to add assignment");
    }
  });

  const toggleAssignmentMutation = useMutation({
    mutationFn: ({ courseId, assignmentId }: { courseId: string, assignmentId: string }) => 
      courseService.toggleAssignmentStatus(courseId, assignmentId),
    onMutate: async ({ courseId, assignmentId }) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      await queryClient.cancelQueries({ queryKey: ['course', courseId] });
      
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      const previousCourse = queryClient.getQueryData(['course', courseId]) as Course | undefined;
      
      // Update courses list
      if (previousCourses) {
        const updatedCourses = safeArray(previousCourses).map(course => {
          if (course.id === courseId) {
            const updatedAssignments = safeArray(course.assignments).map(a => 
              a.id === assignmentId ? { ...a, isSubmitted: !a.isSubmitted } : a
            );
            return { ...course, assignments: updatedAssignments };
          }
          return course;
        });
        
        queryClient.setQueryData(['courses'], updatedCourses);
      }
      
      // Update individual course if it's loaded
      if (previousCourse) {
        const updatedAssignments = safeArray(previousCourse.assignments).map(a => 
          a.id === assignmentId ? { ...a, isSubmitted: !a.isSubmitted } : a
        );
        
        const updatedCourse = { ...previousCourse, assignments: updatedAssignments };
        queryClient.setQueryData(['course', courseId], updatedCourse);
      }
      
      return { previousCourses, previousCourse };
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
    onError: (error, { courseId }, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(['course', courseId], context.previousCourse);
      }
      console.error("Error toggling assignment status:", error);
      toast.error("Failed to update assignment");
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ courseId, note }: { courseId: string, note: Omit<Note, "id" | "dateAdded"> }) => 
      courseService.addNote(courseId, note),
    onMutate: async ({ courseId, note }) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      await queryClient.cancelQueries({ queryKey: ['course', courseId] });
      
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      const previousCourse = queryClient.getQueryData(['course', courseId]) as Course | undefined;
      
      // Create optimistic note
      const optimisticNote: Note = {
        ...note,
        id: `temp-${Date.now()}`,
        dateAdded: new Date().toISOString()
      };
      
      // Update courses list
      if (previousCourses) {
        const updatedCourses = safeArray(previousCourses).map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              notes: [...safeArray(course.notes), optimisticNote]
            };
          }
          return course;
        });
        
        queryClient.setQueryData(['courses'], updatedCourses);
      }
      
      // Update individual course if it's loaded
      if (previousCourse) {
        const updatedCourse = {
          ...previousCourse,
          notes: [...safeArray(previousCourse.notes), optimisticNote]
        };
        
        queryClient.setQueryData(['course', courseId], updatedCourse);
      }
      
      return { previousCourses, previousCourse };
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success("Note added successfully");
    },
    onError: (error, { courseId }, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(['course', courseId], context.previousCourse);
      }
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  });

  const addGradeMutation = useMutation({
    mutationFn: ({ courseId, grade }: { courseId: string, grade: Omit<Grade, "id"> }) => 
      courseService.addGrade(courseId, grade),
    onMutate: async ({ courseId, grade }) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      await queryClient.cancelQueries({ queryKey: ['course', courseId] });
      
      const previousCourses = queryClient.getQueryData(['courses']) as Course[];
      const previousCourse = queryClient.getQueryData(['course', courseId]) as Course | undefined;
      
      // Create optimistic grade
      const optimisticGrade: Grade = {
        ...grade,
        id: `temp-${Date.now()}`
      };
      
      // Update courses list
      if (previousCourses) {
        const updatedCourses = safeArray(previousCourses).map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              grades: [...safeArray(course.grades), optimisticGrade]
            };
          }
          return course;
        });
        
        queryClient.setQueryData(['courses'], updatedCourses);
      }
      
      // Update individual course if it's loaded
      if (previousCourse) {
        const updatedCourse = {
          ...previousCourse,
          grades: [...safeArray(previousCourse.grades), optimisticGrade]
        };
        
        queryClient.setQueryData(['course', courseId], updatedCourse);
      }
      
      return { previousCourses, previousCourse };
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success("Grade added successfully");
    },
    onError: (error, { courseId }, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(['course', courseId], context.previousCourse);
      }
      console.error("Error adding grade:", error);
      toast.error("Failed to add grade");
    }
  });

  // Calculate all assignments across courses with enhanced safety
  const assignments = React.useMemo(() => {
    try {
      // Ensure courses is an array and guard against null/undefined
      const safeCourses = safeArray(courses);
      if (safeCourses.length === 0) return [];
      
      // Use reduce instead of flatMap for better compatibility
      return safeCourses.reduce((allAssignments: Assignment[], course) => {
        // Make sure course assignments exist and are an array
        const courseAssignments = safeArray(course.assignments);
        
        // Add course name to each assignment
        const assignmentsWithCourseName = courseAssignments.map(assignment => ({
          ...assignment,
          courseName: course.name
        }));
        
        // Combine with previous assignments
        return [...allAssignments, ...assignmentsWithCourseName];
      }, []);
    } catch (error) {
      console.error("Error processing assignments:", error);
      return [];
    }
  }, [courses]);

  // Get a specific course by ID
  const getCourse = (id: string) => {
    if (!Array.isArray(courses) || courses.length === 0) {
      return undefined;
    }
    return courses.find(course => course.id === id);
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
      grade
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
