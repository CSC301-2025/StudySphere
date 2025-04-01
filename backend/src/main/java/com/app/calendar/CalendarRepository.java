package com.app.calendar;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface CalendarRepository extends MongoRepository<CalendarEvent, String> {
    Optional<CalendarEvent> getCalendarEventById(String id);

    // New method to get a list of events by userID
    Optional<List<CalendarEvent>> getCalendarEventsByUserID(String userID);

    // New method to get an event by both userID and event id
    Optional<CalendarEvent> getCalendarEventByUserIDAndId(String userID, String id);
}
