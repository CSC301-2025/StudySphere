
import axiosClient from "@/lib/axiosClient";
import { addDays, addWeeks, addMonths, isBefore } from "date-fns";

export interface CalendarEvent {
  id?: string;
  title: string;
  description: string;
  eventDate: Date;
  userID?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  originalEventId?: string;
}

export const calendarService = {
  getAllEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const response = await axiosClient.get('/calendar');
      
      // Ensure we're working with an array even if response is empty or malformed
      const baseEvents: CalendarEvent[] = Array.isArray(response.data) ? response.data.map((event: any) => ({
        ...event,
        eventDate: new Date(event.eventDate)
      })) : [];

      // Handle recurring events - safely
      const expandedEvents = [...baseEvents];
      
      // Only process recurring events if we have valid base events
      if (baseEvents.length > 0) {
        baseEvents.forEach(event => {
          if (event && event.isRecurring && event.recurrencePattern) {
            try {
              const recurringEvents = calendarService.expandRecurringEvents(event);
              if (Array.isArray(recurringEvents) && recurringEvents.length > 0) {
                expandedEvents.push(...recurringEvents);
              }
            } catch (error) {
              console.error('Error expanding recurring event:', error);
              // Continue with other events even if one fails
            }
          }
        });
      }
      
      return expandedEvents;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  },
  
  addEvent: async (event: Omit<CalendarEvent, 'id' | 'userID'>): Promise<CalendarEvent> => {
    try {
      const response = await axiosClient.post('/calendar', event);
      return {
        ...response.data,
        eventDate: new Date(response.data.eventDate)
      };
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw error;
    }
  },
  
  deleteEvent: async (eventId: string): Promise<void> => {
    try {
      await axiosClient.delete(`/calendar/${eventId}`);
    } catch (error) {
      console.error(`Error deleting calendar event ${eventId}:`, error);
      throw error;
    }
  },

  updateEvent: async (eventId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const response = await axiosClient.put(`/calendar/${eventId}`, event);
      return {
        ...response.data,
        eventDate: new Date(response.data.eventDate)
      };
    } catch (error) {
      console.error(`Error updating calendar event ${eventId}:`, error);
      throw error;
    }
  },

  // Generate recurring event instances based on the recurrence pattern
  expandRecurringEvents: (event: CalendarEvent): CalendarEvent[] => {
    if (!event || !event.isRecurring || !event.recurrencePattern) {
      return [];
    }

    const recurringEvents: CalendarEvent[] = [];
    
    try {
      // Use the specified start date or fall back to the event date
      const startDate = event.recurrenceStartDate 
        ? new Date(event.recurrenceStartDate) 
        : new Date(event.eventDate);
        
      // Validate start date
      if (isNaN(startDate.getTime())) {
        console.error('Invalid start date for recurring event', event);
        return [];
      }
        
      let endDate: Date | undefined;

      if (event.recurrenceEndDate) {
        endDate = new Date(event.recurrenceEndDate);
        // Validate end date
        if (isNaN(endDate.getTime())) {
          console.error('Invalid end date for recurring event', event);
          endDate = addMonths(new Date(), 3); // Fallback to default
        }
      } else {
        // If no end date specified, generate events for the next 3 months
        endDate = addMonths(new Date(), 3);
      }

      let currentDate = new Date(startDate);
      
      // Skip the first occurrence if it's the same as the event date
      const eventDate = new Date(event.eventDate);
      if (!isNaN(eventDate.getTime()) && currentDate.getTime() === eventDate.getTime()) {
        switch (event.recurrencePattern) {
          case 'daily':
            currentDate = addDays(currentDate, 1);
            break;
          case 'weekly':
            currentDate = addWeeks(currentDate, 1);
            break;
          case 'monthly':
            currentDate = addMonths(currentDate, 1);
            break;
          default:
            // Invalid pattern, don't move the date
            break;
        }
      }

      // Only proceed if we have valid dates
      if (!isNaN(currentDate.getTime()) && !isNaN(endDate.getTime())) {
        // Generate recurring instances with a safety limit
        const MAX_RECURRENCES = 100; // Prevent infinite loops
        let count = 0;
        
        while (isBefore(currentDate, endDate) && count < MAX_RECURRENCES) {
          recurringEvents.push({
            ...event,
            id: `${event.id}-recurrence-${currentDate.getTime()}`,
            eventDate: new Date(currentDate),
            originalEventId: event.id,
          });

          // Move to next occurrence
          switch (event.recurrencePattern) {
            case 'daily':
              currentDate = addDays(currentDate, 1);
              break;
            case 'weekly':
              currentDate = addWeeks(currentDate, 1);
              break;
            case 'monthly':
              currentDate = addMonths(currentDate, 1);
              break;
            default:
              // Prevent infinite loop for invalid patterns
              count = MAX_RECURRENCES;
              break;
          }
          
          count++;
        }
      }
    } catch (error) {
      console.error('Error generating recurring events:', error);
      return [];
    }

    return recurringEvents;
  }
};
