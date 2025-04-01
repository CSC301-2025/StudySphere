package com.app.Notification;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;
import com.app.security.JWTGenerator;

import jakarta.servlet.http.HttpServletRequest;

import com.app.security.JWTAuthenticationFilter;


import java.util.List;

@RestController
@RequestMapping("api/Notification")
public class NotificationController {
    private final NotificationService notificationService;

    // JWT Generator
    JWTGenerator jwt;

    public NotificationController(NotificationService notificationService, JWTGenerator jwt) {
        this.notificationService = notificationService;
        this.jwt = jwt;
    }

    // get request to get all notifications for that user
    @GetMapping
    public List<NotificationDto> getAllNotifications(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return notificationService.getAllNotifications(userID);
    }

    // get request to get a notification by id
    @GetMapping("/{id}")
    public NotificationDto getNotificationById(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return notificationService.getNotificationById(userID, id);
    }

    // post request to add a notification
    @PostMapping
    public ResponseEntity<NotificationDto> addNotification(HttpServletRequest request, @RequestBody NotificationDto notificationDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(notificationService.addNotification(userID, notificationDto), HttpStatus.CREATED);
    }

    // delete request to delete a notification
    @DeleteMapping("/{id}")
    public void deleteNotification(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        notificationService.deleteNotification(userID, id);
    }

}
