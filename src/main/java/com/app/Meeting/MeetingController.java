package com.app.Meeting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @GetMapping
    public ResponseEntity<List<MeetingEntity>> getAllMeeting() {
        List<MeetingEntity> meeting = meetingService.getAllMeeting();
        return new ResponseEntity<>(meeting, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingEntity> getMeetingById(@PathVariable String id) {
        MeetingEntity meeting = meetingService.getMeetingById(id);
        if (meeting != null) {
            return new ResponseEntity<>(meeting, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createMeeting(@RequestBody MeetingEntity meeting) {
        try {
            MeetingEntity createdMeeting = meetingService.createMeeting(meeting);
            return new ResponseEntity<>(createdMeeting, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Return BAD_REQUEST if User or Tutor doesn't exist.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeetingEntity> updateMeeting(@PathVariable String id, @RequestBody MeetingEntity meeting) {
        try {
            MeetingEntity updatedMeeting = meetingService.updateMeeting(id, meeting);
            return new ResponseEntity<>(updatedMeeting, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable String id) {
        meetingService.deleteMeeting(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
