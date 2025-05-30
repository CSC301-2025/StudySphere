
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, FileText, Calendar, ArrowRight } from "lucide-react";
import { useCourses } from "../context/CourseContext";
import CourseCard from "../components/CourseCard";

// Enhanced safe array helper function with better type checking
const safeArray = <T,>(arr: T[] | null | undefined): T[] => {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  return arr;
};

const Index = () => {
  const { courses, assignments, isLoading } = useCourses();
  
  // Enhanced safety - Get upcoming assignments with comprehensive checks
  const upcomingAssignments = React.useMemo(() => {
    try {
      const safeAssignments = safeArray(assignments);
      if (safeAssignments.length === 0) return [];
      
      return safeAssignments
        .filter(assignment => {
          if (!assignment) return false;
          return !assignment.submitted && new Date(assignment.dueDate) > new Date();
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } catch (error) {
      console.error("Error processing upcoming assignments:", error);
      return [];
    }
  }, [assignments]);

  // Format date for display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    }
  };

  // Safely find a course by name
  const findCourseIdByName = (courseName: string): string => {
    const safeCourses = safeArray(courses);
    if (safeCourses.length === 0) return '';
    
    const course = safeCourses.find(c => c && c.name === courseName);
    return course?.id || '';
  };

  return (
    <div className="page-container pb-16 animate-fadeIn">
      {/* Welcome Section */}
      <div className="glass-card rounded-xl p-8 mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Student</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Track your courses, assignments, and academic progress all in one place.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/sections" className="btn-primary">
            Browse Courses
          </Link>
          <Link to="/calendar" className="btn-outline">
            View Calendar
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Courses</h2>
              <Link 
                to="/sections" 
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <span>View all</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeArray(courses).length > 0 ? (
                safeArray(courses).slice(0, 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : isLoading ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No courses available. Add your first course!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upcoming Assignments */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Upcoming Due</h2>
          <div className="glass-card rounded-xl p-5">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading assignments...</p>
              </div>
            ) : upcomingAssignments.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={32} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  You have no upcoming assignments.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAssignments.slice(0, 5).map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-secondary transition-colors"
                  >
                    <div className="p-2 rounded-md bg-primary/10 mt-1">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div>
                      <Link 
                        to={`/course/${findCourseIdByName(assignment.courseName)}/assignments`}
                        className="font-medium hover:underline line-clamp-1"
                      >
                        {assignment.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mb-1">
                        {assignment.courseName}
                      </p>
                      <p className="text-xs">
                        Due: <span className="text-primary">{formatDueDate(assignment.dueDate)}</span>
                      </p>
                    </div>
                  </div>
                ))}
                
                {upcomingAssignments.length > 5 && (
                  <Link 
                    to="/upcoming" 
                    className="flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2"
                  >
                    <span>View all upcoming</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="glass-card rounded-xl p-5 mt-6">
            <h3 className="font-medium mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/calendar" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <Calendar size={18} className="text-primary" />
                <span>Calendar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
