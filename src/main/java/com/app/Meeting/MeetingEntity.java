package com.app.Meeting;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
public class MeetingEntity {
    @Id
    private String id;
    private String userId;
    private String tutorId;
    private LocalDateTime meetingDate;

    public MeetingEntity(String userId, String tutorId, LocalDateTime meetingDate) {
        this.userId = userId;
        this.tutorId = tutorId;
        this.meetingDate = meetingDate;
    }
}
