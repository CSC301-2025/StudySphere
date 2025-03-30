package com.app.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private String notificationID;
    private String notificationTitle;
    private String notificationDescription;
    private LocalDateTime notificationTimestamp;
    private boolean read;

    public NotificationDto() {
    }

    public NotificationDto(String notificationID, String notificationTitle, String notificationDescription, 
    LocalDateTime notificationTimestamp, boolean read) {
        this.notificationID = notificationID;
        this.notificationTitle = notificationTitle;
        this.notificationDescription = notificationDescription;
        this.notificationTimestamp = notificationTimestamp;
        this.read = read;

    }

}
