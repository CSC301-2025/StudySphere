package com.app.Meeting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// Import UserService and TutorService from their packages
import com.app.User.UserService;
import com.app.Tutor.TutorService;

@Service
public class MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private TutorService tutorService;

    public List<MeetingEntity> getAllMeeting() {
        return meetingRepository.findAll();
    }

    public MeetingEntity getMeetingById(String id) {
        return meetingRepository.findById(id).orElse(null);
    }

    public MeetingEntity createMeeting(MeetingEntity meeting) {
        // Check if the User exists
        if (userService.getUserById(meeting.getUserId()) == null) {
            throw new IllegalArgumentException("User not found with id: " + meeting.getUserId());
        }
        // Check if the Tutor exists
        if (tutorService.getTutorById(meeting.getTutorId()) == null) {
            throw new IllegalArgumentException("Tutor not found with id: " + meeting.getTutorId());
        }
        // If both exist, save the meeting in MongoDB.
        return meetingRepository.save(meeting);
    }

    public MeetingEntity updateMeeting(String id, MeetingEntity meeting) {
        Optional<MeetingEntity> optionalMeeting = meetingRepository.findById(id);
        if (optionalMeeting.isPresent()) {
            MeetingEntity existingMeeting = optionalMeeting.get();
            existingMeeting.setUserId(meeting.getUserId());
            existingMeeting.setTutorId(meeting.getTutorId());
            existingMeeting.setMeetingDate(meeting.getMeetingDate());
            return meetingRepository.save(existingMeeting);
        }
        throw new RuntimeException("Meeting not found with id: " + id);
    }

    public void deleteMeeting(String id) {
        meetingRepository.deleteById(id);
    }
}
