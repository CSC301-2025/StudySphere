package com.app.Notification;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDto> getAllNotifications(String userID) {
        return notificationRepository.getNotificationsByUserID(userID)
            .map(notificationEntities -> notificationEntities.stream()
                .map(this::toDTO) // assumes you have a toDTO(NotificationEntity) method
                .collect(Collectors.toList()))
            .orElse(Collections.emptyList());
    }


    public NotificationDto getNotificationById(String userID, String id) {
        return notificationRepository.findByUserIDAndNotificationID(userID, id)
            .map(this::toDTO)
            .orElse(null);
    }

    public NotificationDto addNotification(String userID, NotificationDto notificationDto) {
        NotificationEntity savedEntity = notificationRepository.save(toEntity(userID, notificationDto));
        savedEntity.setRead(false);
        return toDTO(savedEntity);
    }

    public void deleteNotification(String userID, String id) {
        Optional<NotificationEntity> optional_Entity = notificationRepository.findByUserIDAndNotificationID(userID, id);
        if (optional_Entity.isPresent()) {
            NotificationEntity notificationEntity = optional_Entity.get();
            notificationRepository.delete(notificationEntity);
        }
    }

    private NotificationEntity toEntity(String userID, NotificationDto notificationDto) {
        NotificationEntity notificationEntity = new NotificationEntity();
    
        notificationEntity.setNotificationID(notificationDto.getNotificationID());
        notificationEntity.setUserID(userID);
        notificationEntity.setNotificationTitle(notificationDto.getNotificationTitle());
        notificationEntity.setNotificationDescription(notificationDto.getNotificationDescription());
        notificationEntity.setNotificationTimestamp(notificationDto.getNotificationTimestamp());
        notificationEntity.setRead(notificationDto.isRead());
    
        return notificationEntity;
    }
    
    private NotificationDto toDTO(NotificationEntity notificationEntity) {
        return new NotificationDto(
            notificationEntity.getNotificationID(),
            notificationEntity.getNotificationTitle(),
            notificationEntity.getNotificationDescription(),
            notificationEntity.getNotificationTimestamp(),
            notificationEntity.isRead()
        );
    }
}
    
