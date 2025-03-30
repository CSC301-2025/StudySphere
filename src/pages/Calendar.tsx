
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, BookOpen, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameDay, isToday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCourses } from '@/context/CourseContext';
import { toast } from "sonner";
import { DayContent, DayContentProps } from 'react-day-picker';
import axiosClient from "@/lib/axiosClient";

type EventType = 'assignment' | 'lecture' | 'reminder' | 'other';

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: EventType;
  courseId?: string;
  courseName?: string;
  color?: string;
};

/** 
 * Convert the backend CalendarEvent object to our front-end Event type.
 * - `eventDate` is a string or ISO date from the backend, 
 *   so we parse it into a real JavaScript Date.
 */
function fromBackendEvent(backendEvent: any): Event {
  return {
    id: backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    date: new Date(backendEvent.eventDate),  // parse ISO string
    type: 'reminder',  // default or map from your backend if needed
  };
}

const CalendarPage = () => {
  const { courses } = useCourses();

  // Keep track of the currently selected month & day in the calendar:
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // For adding a new event via Dialog:
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    type: 'reminder',
  });

  // --- 1) State for backend-fetched events
  const [backendEvents, setBackendEvents] = useState<Event[]>([]);

  // --- 2) State for user-created "manual" events
  const [manualEvents, setManualEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Study Session',
      description: 'Review materials for upcoming midterm',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      type: 'reminder',
    },
    {
      id: '2',
      title: 'Office Hours',
      description: 'Professor Wilson office hours',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      type: 'other',
    },
  ]);

  // --- 3) Generate events from course assignments + lectures
  function generateEventsFromCourses(): Event[] {
    const courseEvents: Event[] = [];

    courses.forEach(course => {
      // Add assignments
      course.assignments.forEach(assignment => {
        courseEvents.push({
          id: `assignment-${assignment.id}`,
          title: assignment.title,
          description: assignment.description,
          date: new Date(assignment.dueDate),
          type: 'assignment',
          courseId: course.id,
          courseName: course.name,
          color: course.color
        });
      });

      // Add lectures (notes)
      course.notes.forEach(note => {
        courseEvents.push({
          id: `lecture-${note.id}`,
          title: note.title,
          description: note.content,
          date: new Date(note.dateAdded),
          type: 'lecture',
          courseId: course.id,
          courseName: course.name,
          color: course.color
        });
      });
    });

    return courseEvents;
  }

  // --- 4) Combine backend events + manual events + course events
  const allEvents = [
    ...backendEvents,
    ...manualEvents,
    ...generateEventsFromCourses(),
  ];

  // --- 5) Create a date-based dictionary for easier display
  const eventsByDate: Record<string, Event[]> = {};
  allEvents.forEach(evt => {
    const dateKey = format(evt.date, 'yyyy-MM-dd');
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(evt);
  });

  // --- 6) Fetch from the backend on mount
  useEffect(() => {
    fetchBackendEvents();
  }, []);

  async function fetchBackendEvents() {
    try {
      const response = await axiosClient.get(`/calendar`);
      const data = response.data;
      // Convert each backend event to front-end form:
      const parsed = data.map((item: any) => fromBackendEvent(item));
      setBackendEvents(parsed);
    } catch (error) {
      console.error('Error fetching events from backend:', error);
      throw error;
    }
  }

  // --- 7) POST new event to backend
  async function createBackendEvent(event: Omit<Event, 'id'>) {
    // try {
      // const response = await axiosClient.post('/calendar')
    try {
      const response = await axiosClient.post('/calendar', {
        title: event.title,
        description: event.description,
        eventDate: event.date,         // <--- rename here
        type: event.type,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // --- 8) DELETE event from backend
  async function deleteBackendEvent(eventId: string) {
    try {
      await axiosClient.delete(`/calendar/${eventId}`);
      setBackendEvents(prev => prev.filter(e => e.id !== eventId));
      toast.success("Event deleted from backend!");
    } catch (error) {
      console.error(`Error deleting event ${eventId}:`, error);
      throw error;
    }
  }

  // --- 9) A custom day component for the <Calendar />
  const CustomDayContent = (props: DayContentProps) => {
    const { date: dayDate, ...rest } = props;
    if (!dayDate || isNaN(dayDate.getTime())) {
      return <DayContent {...props} />;
    }

    const dayKey = format(dayDate, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dayKey] || [];

    return (
      <div
        className={cn(
          "relative h-full w-full flex flex-col items-center justify-center",
          dayEvents.length > 0 && "font-semibold"
        )}
        onClick={() => setSelectedDate(dayDate)}
      >
        <DayContent {...props} />

        {dayEvents.length > 0 && (
          <div className="absolute bottom-0 flex gap-0.5">
            {dayEvents.slice(0, 3).map((evt, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full",
                  evt.type === 'assignment' && "bg-red-500",
                  evt.type === 'lecture' && "bg-green-500",
                  evt.type === 'reminder' && "bg-blue-500",
                  evt.type === 'other' && "bg-yellow-500",
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

  // --- 10) The events for the currently selected date:
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEvents = eventsByDate[selectedDateKey] || [];

  // --- 11) Add new event
  async function handleAddEvent() {
    if (!newEvent.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    // If you want to store it in the backend:
    await createBackendEvent({
      ...newEvent,
      date: selectedDate,
    });

    // Or also store locally:
    // const localId = crypto.randomUUID();
    // setManualEvents([...manualEvents, { ...newEvent, id: localId, date: selectedDate }]);

    // Reset form
    setNewEvent({ title: '', description: '', date: new Date(), type: 'reminder' });
    setIsAddEventOpen(false);
  }

  // --- 12) Delete an event (first check if it's from backend or local)
  function handleDeleteEvent(eventId: string) {
    // Is it from the backend?
    const foundBackend = backendEvents.find(e => e.id === eventId);
    if (foundBackend) {
      deleteBackendEvent(eventId);
      return;
    }
    // Otherwise, remove from manual events
    setManualEvents(prev => prev.filter(e => e.id !== eventId));
    toast.success("Local event deleted!");
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
                    <Button type="submit" onClick={handleAddEvent}>Save Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              {selectedDateEvents.length === 0 ? (
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
                          >
                            <Trash2 className="h-4 w-4" />
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
