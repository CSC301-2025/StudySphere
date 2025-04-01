
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Clock } from "lucide-react";
import { type Course } from "../context/CourseContext";
import TextToSpeech from "./TextToSpeech";

type CourseCardProps = {
  course: Course;
};

const CourseCard = ({ course }: CourseCardProps) => {
  // Count upcoming assignments (not submitted and due date in the future)
  const upcomingAssignmentsCount = course.assignments.filter(assignment => {
    return !assignment.submitted && new Date(assignment.dueDate) > new Date();
  }).length;
  
  // Get the closest assignment due date
  const closestAssignment = course.assignments.length > 0 
    ? course.assignments
        .filter(a => !a.submitted)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
    : null;

  // Format date to display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Generate simpler content for text-to-speech - just the course name
  const speechContent = `Course: ${course.name}`;

  return (
    <Link 
      to={`/course/${course.id}`} 
      className="block w-full"
    >
      <div className="glass-card rounded-xl p-5 card-hover">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {course.code}
            </span>
            <div className="flex items-center">
              <TextToSpeech 
                text={speechContent} 
                tooltipText="Listen to course name"
                preventNavigation={true}
              />
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          </div>
          
          <h3 className="text-lg font-medium mt-2 mb-1">{course.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>
          
          <p className="text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="mt-auto pt-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen size={16} className="mr-1" />
                <span>{course.schedule}</span>
              </div>
              
              {upcomingAssignmentsCount > 0 && closestAssignment && (
                <div className="flex items-center text-sm">
                  <Clock size={16} className="mr-1 text-primary" />
                  <span>
                    {formatDueDate(closestAssignment.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
