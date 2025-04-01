import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarService, CalendarEvent } from "@/services/calendarService";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/context/CourseContext";

// Form schema with validation rules
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(50, {
    message: "Title must not exceed 50 characters."
  }),
  description: z.string().max(200, {
    message: "Description must not exceed 200 characters."
  }).optional(),
  reminderDate: z.date({
    required_error: "Reminder date is required.",
  }),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)."
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
}

const AddReminderDialog: React.FC<AddReminderDialogProps> = ({
  open,
  onOpenChange,
  course,
}) => {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `Reminder for ${course.name}`,
      description: "",
      reminderDate: new Date(),
      reminderTime: format(new Date(), "HH:mm"),
    },
  });
  
  // Calendar event mutation
  const addEventMutation = useMutation({
    mutationFn: (event: Omit<CalendarEvent, 'id' | 'userID'>) => 
      calendarService.addEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success("Reminder added to calendar");
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset form
      form.reset();
    },
    onError: (error) => {
      console.error("Error adding reminder to calendar:", error);
      toast.error("Failed to add reminder to calendar");
    },
  });

  const onSubmit = (data: FormValues) => {
    try {
      // Combine date and time
      const reminderDate = new Date(data.reminderDate);
      const [hours, minutes] = data.reminderTime.split(':').map(Number);
      reminderDate.setHours(hours, minutes);

      // Prepare the calendar event
      const calendarEvent = {
        title: data.title,
        description: `${data.description || ''}\nCourse: ${course.name}`,
        eventDate: reminderDate,
        isRecurring: false
      };

      // Submit the event to the calendar service
      addEventMutation.mutate(calendarEvent);
      
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast.error("Failed to set reminder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
          <DialogDescription>
            Create a reminder for {course.name}
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
                    <Input placeholder="Enter reminder title" {...field} />
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about this reminder"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reminderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      24-hour format (HH:MM)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={addEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addEventMutation.isPending}
              >
                {addEventMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Reminder"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;
