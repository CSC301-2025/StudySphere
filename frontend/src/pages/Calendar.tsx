
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'assignment' | 'exam' | 'reminder' | 'other';
};

interface CalendarDayProps {
  day: Date;
  displayMonth?: Date;
  isSelected: boolean;
  isToday: boolean;
  onClick?: () => void;
  events: Event[];
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    type: 'reminder',
  });

  // Create sample events with current year dates to avoid invalid dates
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Sample events (in real app, these would come from a database or API)
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Complete Math Assignment',
      description: 'Finish the calculus problems from chapter 5',
      date: new Date(currentYear, currentMonth, 15),
      type: 'assignment',
    },
    {
      id: '2',
      title: 'Physics Exam',
      description: 'Midterm exam covering chapters 1-4',
      date: new Date(currentYear, currentMonth, 20),
      type: 'exam',
    },
    {
      id: '3',
      title: 'Group Project Meeting',
      description: 'Meet with team to discuss project timeline',
      date: new Date(currentYear, currentMonth, 18),
      type: 'reminder',
    },
  ]);

  // Create a mapping of events by date for easy lookup
  const eventsByDate: Record<string, Event[]> = {};
  events.forEach(event => {
    const dateKey = format(event.date, 'yyyy-MM-dd');
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  // Custom day renderer for the calendar
  const CalendarDay = ({ day, displayMonth, isSelected, isToday, onClick }: CalendarDayProps) => {
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
      return null; // Skip rendering if day is invalid
    }
    
    // Get events for this day
    const dayKey = format(day, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dayKey] || [];
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div
        onClick={onClick}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center p-0 font-normal aria-selected:opacity-100",
          isToday && "bg-accent text-accent-foreground font-semibold",
          isSelected && "bg-primary text-primary-foreground",
          hasEvents && !isSelected && !isToday && "bg-secondary/50",
          hasEvents && "font-semibold"
        )}
      >
        {day.getDate()}
        {hasEvents && (
          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full",
                  event.type === 'assignment' && "bg-red-500",
                  event.type === 'exam' && "bg-yellow-500",
                  event.type === 'reminder' && "bg-blue-500",
                  event.type === 'other' && "bg-green-500",
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get events for the selected date
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEvents = eventsByDate[selectedDateKey] || [];

  const handleAddEvent = () => {
    const event: Event = {
      ...newEvent,
      id: crypto.randomUUID(),
      date: selectedDate,
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', date: new Date(), type: 'reminder' });
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

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
                  Day: CalendarDay as any
                }}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-xs">Assignment</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-xs">Exam</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-xs">Reminder</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-green-500" />
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
                      <select
                        id="type"
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                        <option value="reminder">Reminder</option>
                        <option value="other">Other</option>
                      </select>
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
                              event.type === 'exam' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                              event.type === 'reminder' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              event.type === 'other' && "bg-green-500/10 text-green-500 border-green-500/20",
                            )}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
