
import React from "react";
import { Link } from "react-router-dom";
import { Clock, CalendarDays, BookOpen, ArrowLeft } from "lucide-react";
import { useCourses } from "../context/CourseContext";

const Upcoming = () => {
  const { courses, assignments } = useCourses();
  
  // Get upcoming assignments (not submitted and due date in the future)
  const upcomingAssignments = assignments.filter(assignment => {
    return !assignment.isSubmitted && new Date(assignment.dueDate) > new Date();
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

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

  // Get time remaining
  const getTimeRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(diffTime / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  // Group assignments by due date
  const groupAssignmentsByDate = () => {
    const groupedAssignments: { [key: string]: typeof upcomingAssignments } = {};
    
    upcomingAssignments.forEach(assignment => {
      const date = new Date(assignment.dueDate);
      const dateKey = date.toDateString();
      
      if (!groupedAssignments[dateKey]) {
        groupedAssignments[dateKey] = [];
      }
      
      groupedAssignments[dateKey].push(assignment);
    });
    
    return groupedAssignments;
  };
  
  const groupedAssignments = groupAssignmentsByDate();
  const dates = Object.keys(groupedAssignments).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="page-container pb-16 animate-fadeIn">
      <div className="mb-6">
        <Link 
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upcoming Due</h1>
          <p className="text-muted-foreground">
            {upcomingAssignments.length} {upcomingAssignments.length === 1 ? "assignment" : "assignments"} due soon
          </p>
        </div>
      </div>
      
      {upcomingAssignments.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <Clock size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">You're all caught up!</h2>
          <p className="text-muted-foreground mb-6">You have no upcoming assignments due.</p>
          <Link to="/calendar" className="btn-primary">
            View Calendar
          </Link>
        </div>
      ) : (
        <>
          {/* Assignment groups by date */}
          <div className="space-y-8">
            {dates.map(dateKey => {
              const dateObj = new Date(dateKey);
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              let dateLabel = '';
              if (dateObj.toDateString() === today.toDateString()) {
                dateLabel = 'Today';
              } else if (dateObj.toDateString() === tomorrow.toDateString()) {
                dateLabel = 'Tomorrow';
              } else {
                dateLabel = dateObj.toLocaleDateString("en-US", { 
                  weekday: "long", 
                  month: "long", 
                  day: "numeric"
                });
              }
              
              return (
                <div key={dateKey}>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays size={18} className="text-primary" />
                    <h2 className="text-xl font-medium">{dateLabel}</h2>
                  </div>
                  
                  <div className="glass-card rounded-xl divide-y divide-border">
                    {groupedAssignments[dateKey].map(assignment => {
                      const course = courses.find(c => c.name === assignment.courseName);
                      
                      return (
                        <div 
                          key={assignment.id}
                          className="flex items-start gap-4 p-4"
                        >
                          <div className="p-3 rounded-md bg-primary/10 mt-1">
                            <Clock size={18} className="text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <Link 
                                  to={`/course/${course?.id}/assignments`}
                                  className="text-lg font-medium hover:underline"
                                >
                                  {assignment.title}
                                </Link>
                                
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <BookOpen size={14} />
                                  <span>{assignment.courseName}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  Due: {formatDueDate(assignment.dueDate)}
                                </div>
                                <div className="text-xs text-primary mt-1">
                                  {getTimeRemaining(assignment.dueDate)} remaining
                                </div>
                              </div>
                            </div>
                            
                            {assignment.description && (
                              <p className="text-sm text-muted-foreground mt-3">
                                {assignment.description}
                              </p>
                            )}
                            
                            <div className="flex justify-end mt-4">
                              <Link 
                                to={`/course/${course?.id}/assignments`}
                                className="btn-outline btn-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Upcoming;
