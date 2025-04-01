
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, BookOpen, Clock, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameDay, isToday, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCourses } from '@/context/CourseContext';
import { toast } from "sonner";
import { DayContent, DayContentProps } from 'react-day-picker';
import { calendarService, CalendarEvent as CalendarEventType } from '@/services/calendarService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'assignment' | 'lecture' | 'reminder' | 'other';
  courseId?: string;
  courseName?: string;
  color?: string;
};

const CalendarPage = () => {
  const { courses } = useCourses();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    type: 'reminder',
  });
  
  // Fetch calendar events from backend
  const { data: backendEvents = [], isLoading, error, isError } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarService.getAllEvents,
  });

  const addEventMutation = useMutation({
    mutationFn: (event: Omit<CalendarEventType, 'id' | 'userID'>) => 
      calendarService.addEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success("Event added successfully");
      setIsAddEventOpen(false);
      setNewEvent({ title: '', description: '', date: new Date(), type: 'reminder' });
    },
    onError: (error) => {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => calendarService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    },
  });
  
  // Generate events from course assignments and lectures (notes)
  const generateEvents = (): Event[] => {
    const events: Event[] = [];
    
    // Add assignments
    courses.forEach(course => {
      if (!course || !Array.isArray(course.assignments)) return;
      
      course.assignments.forEach(assignment => {
        if (!assignment.dueDate) return;
        
        try {
          // Parse the date and validate it
          let assignmentDate: Date;
          
          if (typeof assignment.dueDate === 'string') {
            assignmentDate = new Date(assignment.dueDate);
            // Check if the date is valid
            if (!isValid(assignmentDate)) {
              console.warn(`Invalid assignment date: ${assignment.dueDate}`);
              return;
            }
          } else {
            assignmentDate = assignment.dueDate;
          }
          
          events.push({
            id: `assignment-${assignment.id}`,
            title: assignment.title,
            description: assignment.description,
            date: assignmentDate,
            type: 'assignment',
            courseId: course.id,
            courseName: course.name,
            color: course.color
          });
        } catch (error) {
          console.error(`Error processing assignment date: ${assignment.dueDate}`, error);
        }
      });
      
      // Add lectures (notes)
      if (!course || !Array.isArray(course.notes)) return;
      
      course.notes.forEach(note => {
        if (!note.dateAdded) return;
        
        try {
          // Parse the date and validate it
          let noteDate: Date;
          
          if (typeof note.dateAdded === 'string') {
            noteDate = new Date(note.dateAdded);
            // Check if the date is valid
            if (!isValid(noteDate)) {
              console.warn(`Invalid note date: ${note.dateAdded}`);
              return;
            }
          } else {
            noteDate = note.dateAdded;
          }
          
          events.push({
            id: `lecture-${note.id}`,
            title: note.title,
            description: note.content,
            date: noteDate,
            type: 'lecture',
            courseId: course.id,
            courseName: course.name,
            color: course.color
          });
        } catch (error) {
          console.error(`Error processing note date: ${note.dateAdded}`, error);
        }
      });
    });
    
    return events;
  };
  
  // Convert backend events to UI events
  const convertBackendEvents = (): Event[] => {
    if (!Array.isArray(backendEvents)) return [];
    
    return backendEvents.map(event => {
      if (!event) return null;
      
      try {
        // Parse the date and validate it
        let eventDate: Date;
        
        if (typeof event.eventDate === 'string') {
          eventDate = new Date(event.eventDate);
          // Check if the date is valid
          if (!isValid(eventDate)) {
            console.warn(`Invalid backend event date: ${event.eventDate}`);
            return null;
          }
        } else if (event.eventDate instanceof Date) {
          eventDate = event.eventDate;
          if (!isValid(eventDate)) {
            console.warn('Invalid backend event Date object');
            return null;
          }
        } else {
          console.warn('Backend event has no valid date');
          return null;
        }
        
        return {
          id: event.id || '',
          title: event.title || '',
          description: event.description || '',
          date: eventDate,
          type: 'reminder', // Default type for backend events
          ...(event.originalEventId ? { originalEventId: event.originalEventId } : {})
        };
      } catch (error) {
        console.error(`Error processing backend event:`, error, event);
        return null;
      }
    }).filter(Boolean) as Event[]; // Filter out null events
  };
  
  // Combine all events
  const courseEvents = generateEvents();
  const manualEvents = convertBackendEvents();
  const events = [...courseEvents, ...manualEvents];

  // Create a mapping of events by date for easy lookup
  const eventsByDate: Record<string, Event[]> = {};
  events.forEach(event => {
    try {
      if (!event || !event.date || !isValid(event.date)) {
        return; // Skip invalid events
      }
      
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    } catch (error) {
      console.error('Error formatting event date:', error, event);
    }
  });

  // Custom day renderer component
  const CustomDayContent = (props: DayContentProps) => {
    const { date: dayDate, ...rest } = props;
    
    if (!dayDate || !(dayDate instanceof Date) || isNaN(dayDate.getTime())) {
      return <DayContent {...props} />;
    }
    
    const isCurrentDay = isToday(dayDate);
    const isSelected = isSameDay(dayDate, selectedDate);
    
    // Get events for this day
    const dayKey = format(dayDate, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dayKey] || [];
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div
        className={cn(
          "relative h-full w-full flex flex-col items-center justify-center",
          hasEvents && "font-semibold"
        )}
        onClick={() => setSelectedDate(dayDate)}
      >
        <DayContent {...props} />
        
        {hasEvents && (
          <div className="absolute bottom-0 flex gap-0.5">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full",
                  event.type === 'assignment' && "bg-red-500",
                  event.type === 'lecture' && "bg-green-500",
                  event.type === 'reminder' && "bg-blue-500",
                  event.type === 'other' && "bg-yellow-500",
                )}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="h-1 w-1 rounded-full bg-gray-500" />
            )}
          </div>
        )}
      </div>
    );
  };

  // Get events for the selected date
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEvents = eventsByDate[selectedDateKey] || [];

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    
    const calendarEvent: Omit<CalendarEventType, 'id' | 'userID'> = {
      title: newEvent.title,
      description: newEvent.description,
      eventDate: selectedDate,
      isRecurring: false
    };
    
    addEventMutation.mutate(calendarEvent);
  };

  const handleDeleteEvent = (eventId: string) => {
    // Only delete manually added events
    if (eventId.startsWith('assignment-') || eventId.startsWith('lecture-')) {
      // This is a course-related event, we don't delete these directly
      toast.error("Course events cannot be deleted here");
      return;
    }
    
    deleteEventMutation.mutate(eventId);
  };

  if (isError) {
    toast.error("Failed to load calendar events");
    console.error("Calendar error:", error);
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/2 lg:w-2/3">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5 dark:bg-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {format(date, 'MMMM yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <Calendar
                    mode="single"
                    month={date}
                    onMonthChange={setDate}
                    selected={selectedDate}
                    onSelect={(day) => day && setSelectedDate(day)}
                    className="rounded-md border mx-auto"
                    components={{
                      DayContent: CustomDayContent
                    }}
                    showOutsideDays={true}
                    fixedWeeks={true}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-xs">Assignment</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-xs">Lecture</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-xs">Reminder</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="text-xs">Other</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/2 lg:w-1/3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  {format(selectedDate, 'MMMM d, yyyy')}
                </CardDescription>
              </div>
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogDescription>
                      Create a new event for {format(selectedDate, 'MMMM d, yyyy')}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Event title"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Event description"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="type">Event Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value: 'reminder' | 'other') => setNewEvent({ ...newEvent, type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={handleAddEvent}
                      disabled={addEventMutation.isPending}
                    >
                      {addEventMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="mb-2 h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading events...</p>
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No events for this day</p>
                  <p className="text-xs text-muted-foreground mt-1">Click "Add Event" to create one</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-start justify-between rounded-lg border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              event.type === 'assignment' && "bg-red-500/10 text-red-500 border-red-500/20",
                              event.type === 'lecture' && "bg-green-500/10 text-green-500 border-green-500/20",
                              event.type === 'reminder' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              event.type === 'other' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                            )}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        {event.courseName && (
                          <p className="text-xs text-primary mt-1">
                            {event.courseName}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {event.type === 'assignment' || event.type === 'lecture' ? (
                          <div className="h-8 w-8 flex items-center justify-center">
                            {event.type === 'assignment' ? (
                              <Clock className="h-4 w-4 text-red-500" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={deleteEventMutation.isPending}
                          >
                            {deleteEventMutation.isPending && deleteEventMutation.variables === event.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
