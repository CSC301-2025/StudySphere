
import React, { useEffect } from "react";
import { useParams, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useCourses } from "../context/CourseContext";
import CourseHeader from "../components/CourseHeader";
import CourseTab from "../components/CourseTab";
import AssignmentList from "../components/AssignmentList";
import NotesSection from "../components/NotesSection";
import DiscussionsSection from "../components/DiscussionsSection";
import GradeSection from "../components/GradeSection";

// Define tabs
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "assignments", label: "Assignments" },
  { id: "notes", label: "Lecture Notes" },
  { id: "discussions", label: "Discussions" },
  { id: "grades", label: "Grades" },
];

const CourseDetails = () => {
  const { courseId, tabId } = useParams<{ courseId: string; tabId: string }>();
  const navigate = useNavigate();
  const { getCourse, toggleAssignmentStatus, addNote, addDiscussion, addReply } = useCourses();
  
  const course = getCourse(courseId || "");
  
  // Redirect to 404 if course not found
  useEffect(() => {
    if (!course && courseId) {
      navigate("/404", { replace: true });
    }
  }, [course, courseId, navigate]);
  
  if (!course) {
    return null;
  }

  // Course overview content
  const CourseOverview = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Course Description</h3>
        <p className="text-sm leading-relaxed">{course.description}</p>
      </div>
      
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Course Schedule</h3>
        <p className="text-sm mb-4"><span className="font-medium">Class Times:</span> {course.schedule}</p>
        <p className="text-sm"><span className="font-medium">Location:</span> Main Campus, Building A, Room 201</p>
      </div>
      
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Course Materials</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-md bg-secondary">
            <div className="p-2 rounded-md bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Introduction to Computer Science: A Comprehensive Guide</h4>
              <p className="text-xs text-muted-foreground mt-1">Textbook • ISBN: 978-0134670942</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-md bg-secondary">
            <div className="p-2 rounded-md bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M7 3v18"></path>
                <path d="M3 7h18"></path>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">Course Website</h4>
              <a href="#" className="text-xs text-primary hover:underline mt-1 block">
                https://university.edu/cs101
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container pb-16 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Courses</span>
      </button>
      
      {/* Course header */}
      <CourseHeader course={course} />
      
      {/* Tab navigation */}
      <CourseTab tabs={tabs} courseId={course.id} />
      
      {/* Tab content */}
      <Routes>
        <Route path="/" element={<Navigate to={`/course/${course.id}/overview`} replace />} />
        <Route path="/overview" element={<CourseOverview />} />
        <Route path="/assignments" element={
          <AssignmentList 
            course={course} 
            toggleStatus={toggleAssignmentStatus} 
          />
        } />
        <Route path="/notes" element={
          <NotesSection 
            course={course} 
            addNote={(note) => addNote(course.id, note)} 
          />
        } />
        <Route path="/discussions" element={
          <DiscussionsSection 
            course={course} 
            addDiscussion={(discussion) => addDiscussion(course.id, discussion)}
            addReply={(discussionId, reply) => addReply(course.id, discussionId, reply)}
          />
        } />
        <Route path="/grades" element={<GradeSection course={course} />} />
      </Routes>
    </div>
  );
};

export default CourseDetails;
