
import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Plus, Repeat, CalendarRange } from "lucide-react";
import { type Course } from "../context/CourseContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourses } from "../context/CourseContext";

type AssignmentListProps = {
  course: Course;
  toggleStatus: (assignmentId: string) => void;
};

const AssignmentList = ({ course, toggleStatus }: AssignmentListProps) => {
  const { addAssignment } = useCourses();
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    isSubmitted: false,
    isRecurring: false,
    recurrencePattern: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recurrenceEndDate: ''
  });

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

  // Format recurrence pattern for display
  const formatRecurrence = (assignment: any) => {
    if (!assignment.isRecurring) return null;
    
    const patternText = {
      'daily': 'Daily',
      'weekly': 'Weekly',
      'monthly': 'Monthly'
    }[assignment.recurrencePattern || 'weekly'];
    
    if (assignment.recurrenceEndDate) {
      const endDate = new Date(assignment.recurrenceEndDate);
      return `${patternText} until ${endDate.toLocaleDateString()}`;
    }
    
    return patternText;
  };

  // Handle adding a new assignment
  const handleAddAssignment = () => {
    // Format date string to ISO
    let dueDate = newAssignment.dueDate;
    if (dueDate && !dueDate.includes('T')) {
      dueDate = `${dueDate}T23:59:59`;
    }
    
    let recurrenceEndDate = newAssignment.recurrenceEndDate;
    if (recurrenceEndDate && !recurrenceEndDate.includes('T')) {
      recurrenceEndDate = `${recurrenceEndDate}T23:59:59`;
    }
    
    // Only include recurrence fields if it's a recurring assignment
    const assignmentData = {
      ...newAssignment,
      dueDate,
      ...(newAssignment.isRecurring ? {
        recurrencePattern: newAssignment.recurrencePattern,
        recurrenceEndDate: recurrenceEndDate || undefined
      } : {})
    };
    
    addAssignment(course.id, assignmentData);
    
    // Reset form and close dialog
    setNewAssignment({
      title: '',
      description: '',
      dueDate: '',
      isSubmitted: false,
      isRecurring: false,
      recurrencePattern: 'weekly',
      recurrenceEndDate: ''
    });
    setIsAddAssignmentOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Add assignment button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Assignments</h3>
        <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for {course.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Assignment title" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="What needs to be done?" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isRecurring"
                  checked={newAssignment.isRecurring}
                  onCheckedChange={(checked) => 
                    setNewAssignment({ ...newAssignment, isRecurring: checked })
                  }
                />
                <Label htmlFor="isRecurring">Recurring Assignment</Label>
              </div>
              
              {newAssignment.isRecurring && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                    <Select 
                      value={newAssignment.recurrencePattern} 
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                        setNewAssignment({ ...newAssignment, recurrencePattern: value })
                      }
                    >
                      <SelectTrigger id="recurrencePattern">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="recurrenceEndDate">End Date (Optional)</Label>
                    <Input
                      id="recurrenceEndDate"
                      type="date"
                      value={newAssignment.recurrenceEndDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, recurrenceEndDate: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddAssignment}>Add Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Upcoming assignments */}
      <div>
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium mb-1">{assignment.title}</h4>
                      {(assignment as any).isRecurring && (
                        <span className="flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Repeat size={12} className="mr-1" />
                          Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {assignment.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-primary" />
                        <span className={`text-xs ${
                          isDueSoon(assignment.dueDate) ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          Due: {formatDate(assignment.dueDate)}
                          {isDueSoon(assignment.dueDate) && " (Soon)"}
                        </span>
                      </div>
                      
                      {formatRecurrence(assignment) && (
                        <div className="flex items-center">
                          <CalendarRange size={14} className="mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatRecurrence(assignment)}
                          </span>
                        </div>
                      )}
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium mb-1">{assignment.title}</h4>
                      {(assignment as any).isRecurring && (
                        <span className="flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Repeat size={12} className="mr-1" />
                          Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {assignment.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
                      
                      {formatRecurrence(assignment) && (
                        <div className="flex items-center">
                          <CalendarRange size={14} className="mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatRecurrence(assignment)}
                          </span>
                        </div>
                      )}
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
