
import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { type Course } from "../context/CourseContext";

type AssignmentListProps = {
  course: Course;
  toggleStatus: (assignmentId: string) => void;
};

const AssignmentList = ({ course, toggleStatus }: AssignmentListProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  // Sort assignments: upcoming first (not submitted and due date in the future), then past
  const sortedAssignments = [...course.assignments].sort((a, b) => {
    const isAUpcoming = !a.isSubmitted && new Date(a.dueDate) > new Date();
    const isBUpcoming = !b.isSubmitted && new Date(b.dueDate) > new Date();
    
    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Group assignments by status: upcoming or past
  const upcomingAssignments = sortedAssignments.filter(
    (assignment) => !assignment.isSubmitted && new Date(assignment.dueDate) > new Date()
  );
  
  const pastAssignments = sortedAssignments.filter(
    (assignment) => assignment.isSubmitted || new Date(assignment.dueDate) <= new Date()
  );

  // Calculate if an assignment is due soon (within 48 hours)
  const isDueSoon = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const hoursDiff = (due.getTime() - now.getTime()) / (1000 * 3600);
    return hoursDiff <= 48 && hoursDiff > 0;
  };

  // Calculate if an assignment is overdue
  const isOverdue = (dueDate: string, isSubmitted: boolean) => {
    return !isSubmitted && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upcoming assignments */}
      <div>
        <h3 className="text-lg font-medium mb-4">Upcoming Assignments</h3>
        {upcomingAssignments.length === 0 ? (
          <div className="glass-card rounded-lg p-4 text-center text-muted-foreground">
            No upcoming assignments
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="glass-card rounded-lg p-4 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {assignment.description}
                    </p>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-primary" />
                      <span className={`text-xs ${
                        isDueSoon(assignment.dueDate) ? "text-destructive" : "text-muted-foreground"
                      }`}>
                        Due: {formatDate(assignment.dueDate)}
                        {isDueSoon(assignment.dueDate) && " (Soon)"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(assignment.id)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Mark as complete"
                  >
                    <CheckCircle size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past assignments */}
      {pastAssignments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Past Assignments</h3>
          <div className="space-y-3">
            {pastAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`glass-card rounded-lg p-4 transition hover:shadow-md ${
                  isOverdue(assignment.dueDate, assignment.isSubmitted)
                    ? "border-destructive/30"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {assignment.description}
                    </p>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-primary" />
                      <span className={`text-xs ${
                        isOverdue(assignment.dueDate, assignment.isSubmitted)
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}>
                        Due: {formatDate(assignment.dueDate)}
                        {isOverdue(assignment.dueDate, assignment.isSubmitted) && " (Overdue)"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(assignment.id)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                    aria-label={assignment.isSubmitted ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {assignment.isSubmitted ? (
                      <CheckCircle size={18} className="text-primary" />
                    ) : (
                      <XCircle size={18} className="text-destructive" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
