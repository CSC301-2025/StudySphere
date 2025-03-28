package com.app.Notification;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
@Data
@NoArgsConstructor
public class NotificationEntity {
    @Id
    private String notificationID;
    private String userID;
    private String notificationTitle;
    private String notificationDescription;
    private LocalDateTime notificationTimestamp;
    private boolean read;

    public NotificationEntity(String notificationID, String userID, String notificationTitle,
                              String notificationDescription, LocalDateTime notificationTimestamp, boolean read) {
        this.notificationID = notificationID;
        this.userID = userID;
        this.notificationTitle = notificationTitle;
        this.notificationDescription = notificationDescription;
        this.notificationTimestamp = notificationTimestamp;
        this.read = read;
    }
}
