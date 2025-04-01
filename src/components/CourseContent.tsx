
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CourseOverview from "./CourseOverview";
import AssignmentList from "./AssignmentList";
import NotesSection from "./NotesSection";
import GradeSection from "./GradeSection";
import { Course } from "@/context/CourseContext";

interface CourseContentProps {
  course: Course;
  onEditCourse: () => void;
  onToggleAssignment: (assignmentId: string) => void;
  onAddNote: (noteData: { title: string; content: string; fileUrl?: string }) => void;
}

const CourseContent = ({ 
  course, 
  onEditCourse, 
  onToggleAssignment, 
  onAddNote 
}: CourseContentProps) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/course/${course.id}/overview`} replace />} />
      <Route path="/overview" element={<CourseOverview course={course} onEditCourse={onEditCourse} />} />
      <Route path="/assignments" element={
        <AssignmentList 
          course={course} 
          toggleStatus={onToggleAssignment} 
        />
      } />
      <Route path="/notes" element={
        <NotesSection 
          course={course} 
          addNote={onAddNote} 
        />
      } />
      <Route path="/grades" element={<GradeSection course={course} />} />
    </Routes>
  );
};

export default CourseContent;
