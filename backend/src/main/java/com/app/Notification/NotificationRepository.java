package com.app.Notification;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<NotificationEntity, String> {

    // Get a list of all the Notifications corresponding to the specified notificationID
    Optional<NotificationEntity> findByUserIDAndNotificationID(String userID, String notificationID);

    // Get a list of all the todos corresponding to the specified userID
    Optional<List<NotificationEntity>> getNotificationsByUserID(String userID);
}