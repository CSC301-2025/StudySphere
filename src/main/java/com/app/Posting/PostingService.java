package com.app.Posting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.app.Tutor.TutorEntity;
import com.app.Tutor.TutorService;
import com.app.User.UserEntity;
import com.app.User.UserService;

@Service
public class PostingService {

    @Autowired
    private PostingRepository postingRepository;
    
    @Autowired
    private TutorService tutorService;

    @Autowired
    private UserService userService;

    public List<PostingEntity> getAllPosting() {
        return postingRepository.findAll();
    }

    public PostingEntity getPostingById(String id) {
        return postingRepository.findById(id).orElse(null);
    }

    public PostingEntity createPosting(PostingEntity posting) {
        // Check if the Tutor exists
        TutorEntity tutor = tutorService.getTutorById(posting.getTutorId());
        UserEntity user = userService.getUserById(posting.getTutorId());
        if (tutor == null) {
            throw new IllegalArgumentException("Tutor not found with id: " + posting.getTutorId());
        }
        // Retrieve and set the contact email from the tutor's record
        posting.setContactEmail(user.getUsername());
        return postingRepository.save(posting);
    }

    public PostingEntity updatePosting(String id, PostingEntity posting) {
        Optional<PostingEntity> optionalPosting = postingRepository.findById(id);
        if (optionalPosting.isPresent()) {
            PostingEntity existingPosting = optionalPosting.get();
            existingPosting.setTutorId(posting.getTutorId());
            existingPosting.setTitle(posting.getTitle());
            existingPosting.setCoursesTaught(posting.getCoursesTaught());
            existingPosting.setDescription(posting.getDescription());
            existingPosting.setLocation(posting.getLocation());
            existingPosting.setPricePerHour(posting.getPricePerHour());
            
            return postingRepository.save(existingPosting);
        }
        throw new RuntimeException("Posting not found with id: " + id);
    }

    public void deletePosting(String id) {
        postingRepository.deleteById(id);
    }
}
