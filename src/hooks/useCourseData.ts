
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";
import { useCourses } from "@/context/CourseContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Course } from "@/context/CourseContext";

export const useCourseData = (courseId?: string) => {
  const navigate = useNavigate();
  const { getCourse, isLoading: isContextLoading, updateCourse } = useCourses();
  const queryClient = useQueryClient();
  
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editableCourse, setEditableCourse] = useState<Course | null>(null);
  
  // Fetch course data from API
  const { 
    data: course, 
    isLoading: isCourseLoading, 
    isError,
    error
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseId ? courseService.getCourseById(courseId) : Promise.reject('No course ID'),
    // Use local data from context while API is loading
    placeholderData: courseId ? getCourse(courseId) : undefined,
    enabled: !!courseId
  });
  
  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: (data: any) => courseService.updateCourse(data.id, data),
    onSuccess: (data) => {
      // Update local context with API data
      updateCourse(data);
      // Invalidate the course query
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course updated successfully");
      setIsEditCourseOpen(false);
    },
    onError: (err) => {
      console.error("Error updating course:", err);
      toast.error("Failed to update course");
    }
  });
  
  // Toggle assignment status mutation
  const toggleAssignmentMutation = useMutation({
    mutationFn: (assignmentId: string) => courseId ? 
      courseService.toggleAssignmentStatus(courseId, assignmentId) : 
      Promise.reject('No course ID'),
    onSuccess: () => {
      // Invalidate the course query
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (err) => {
      console.error("Error toggling assignment status:", err);
      toast.error("Failed to update assignment status");
    }
  });
  
  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (noteData: Omit<any, "id" | "dateAdded">) => courseId ? 
      courseService.addNote(courseId, noteData) : 
      Promise.reject('No course ID'),
    onSuccess: () => {
      // Invalidate the course query
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Note added successfully");
    },
    onError: (err) => {
      console.error("Error adding note:", err);
      toast.error("Failed to add note");
    }
  });
  
  // Set editable course when original course changes
  useEffect(() => {
    if (course) {
      setEditableCourse(course);
    }
  }, [course]);
  
  // Redirect to 404 if course not found after loading
  useEffect(() => {
    if (!isCourseLoading && !isContextLoading && !course && courseId) {
      navigate("/404", { replace: true });
    }
  }, [course, courseId, navigate, isCourseLoading, isContextLoading]);
  
  // Handle editing a course
  const handleEditCourse = () => {
    if (editableCourse) {
      // Use mutation to update course
      updateCourseMutation.mutate(editableCourse);
    }
  };
  
  // Handle toggling assignment status
  const handleToggleAssignment = (assignmentId: string) => {
    // Update backend
    toggleAssignmentMutation.mutate(assignmentId);
  };
  
  // Handle adding a note
  const handleAddNote = (noteData: Omit<any, "id" | "dateAdded">) => {
    // Update backend
    addNoteMutation.mutate(noteData);
  };

  // Handle updating editable course
  const handleEditableCourseChange = (field: string, value: string) => {
    if (editableCourse) {
      setEditableCourse({
        ...editableCourse,
        [field]: value
      });
    }
  };

  return {
    course,
    isLoading: isCourseLoading || isContextLoading,
    isError,
    error,
    isEditCourseOpen,
    setIsEditCourseOpen,
    editableCourse,
    handleEditCourse,
    handleToggleAssignment,
    handleAddNote,
    handleEditableCourseChange
  };
};
