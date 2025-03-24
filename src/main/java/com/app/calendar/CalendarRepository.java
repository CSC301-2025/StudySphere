package com.app.calendar;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CalendarRepository extends MongoRepository<CalendarEvent, String> {
    Optional<CalendarEvent> getCalendarEventById(String id);
}


