
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
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define validation schema using Zod
const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.enum(["daily", "weekly", "monthly"]).optional(),
  recurrenceEndDate: z.string().optional(),
});

type AssignmentListProps = {
  course: Course;
  toggleStatus: (assignmentId: string) => void;
};

const AssignmentList = ({ course, toggleStatus }: AssignmentListProps) => {
  const { addAssignment } = useCourses();
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);

  // Setup form with validation
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      isRecurring: false,
      recurrencePattern: "weekly",
      recurrenceEndDate: "",
    },
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

  // Handle adding a new assignment with validation
  const onSubmit = (data: z.infer<typeof assignmentSchema>) => {
    // Format date string to ISO
    let dueDate = data.dueDate;
    if (dueDate && !dueDate.includes('T')) {
      dueDate = `${dueDate}T23:59:59`;
    }
    
    let recurrenceEndDate = data.recurrenceEndDate;
    if (recurrenceEndDate && !recurrenceEndDate.includes('T')) {
      recurrenceEndDate = `${recurrenceEndDate}T23:59:59`;
    }
    
    // Create assignment data with all required fields explicitly set as non-optional
    const assignmentData = {
      title: data.title,
      description: data.description,
      dueDate,
      isSubmitted: false,
      isRecurring: data.isRecurring,
      ...(data.isRecurring ? {
        recurrencePattern: data.recurrencePattern,
        recurrenceEndDate: recurrenceEndDate || undefined
      } : {})
    };
    
    // Pass along the optimistic UI option
    addAssignment(course.id, assignmentData);
    
    // Reset form and close dialog
    form.reset();
    setIsAddAssignmentOpen(false);
    
    // Show success toast
    toast.success("Assignment added successfully");
  };

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsAddAssignmentOpen(open);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Add assignment button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Assignments</h3>
        <Dialog open={isAddAssignmentOpen} onOpenChange={handleDialogOpenChange}>
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Assignment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What needs to be done?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Recurring Assignment</FormLabel>
                    </FormItem>
                  )}
                />
                
                {form.watch("isRecurring") && (
                  <>
                    <FormField
                      control={form.control}
                      name="recurrencePattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurrence Pattern</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recurrenceEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <DialogFooter>
                  <Button type="submit">Add Assignment</Button>
                </DialogFooter>
              </form>
            </Form>
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
