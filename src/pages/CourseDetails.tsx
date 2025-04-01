
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CourseHeader from "../components/CourseHeader";
import CourseTab from "../components/CourseTab";
import CourseLoading from "../components/CourseLoading";
import CourseError from "../components/CourseError";
import CourseContent from "../components/CourseContent";
import EditCourseDialog from "../components/EditCourseDialog";
import { useCourseData } from "../hooks/useCourseData";

// Define tabs
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "assignments", label: "Assignments" },
  { id: "notes", label: "Lecture Notes" },
  { id: "grades", label: "Grades" },
];

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  const {
    course,
    isLoading,
    isError,
    isEditCourseOpen,
    setIsEditCourseOpen,
    editableCourse,
    handleEditCourse,
    handleToggleAssignment,
    handleAddNote,
    handleEditableCourseChange
  } = useCourseData(courseId);

  // Show loading state
  if (isLoading) {
    return <CourseLoading />;
  }
  
  // Show error state
  if (isError) {
    return <CourseError />;
  }
  
  if (!course) {
    return null;
  }

  return (
    <div className="page-container pb-16 animate-fadeIn">
      {/* Edit Course Dialog */}
      <EditCourseDialog 
        isOpen={isEditCourseOpen}
        onOpenChange={setIsEditCourseOpen}
        course={editableCourse}
        onSave={handleEditCourse}
        onChange={handleEditableCourseChange}
      />

      {/* Back button - navigates directly to /courses */}
      <Link
        to="/courses"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Courses</span>
      </Link>
      
      {/* Course header */}
      <CourseHeader course={course} />
      
      {/* Tab navigation */}
      <CourseTab tabs={tabs} courseId={course.id} />
      
      {/* Tab content */}
      <CourseContent 
        course={course}
        onEditCourse={() => setIsEditCourseOpen(true)}
        onToggleAssignment={handleToggleAssignment}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default CourseDetails;
