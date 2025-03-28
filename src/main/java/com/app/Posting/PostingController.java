package com.app.Posting;

import com.Application;
import com.app.security.JWTAuthenticationFilter;
import com.app.security.JWTGenerator;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/posting")
public class PostingController {

    private final Application application;

    // JWT Generator
    @Autowired
    JWTGenerator jwt;

    @Autowired
    private PostingService postingService;

    PostingController(Application application) {
        this.application = application;
    }

    @GetMapping
    public ResponseEntity<?> getAllPosting( 
        @RequestParam(required = false) String title,
        @RequestParam(required = false) String course,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice) {
        
        // Verify if title is passed, it is not empty
        if (title != null && title.isEmpty()) {
            return new ResponseEntity<>("Title must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if course is passed, it is not empty
        if (course != null && course.isEmpty()) {
            return new ResponseEntity<>("Course must not be empty", HttpStatus.BAD_REQUEST);
        }

        // Verify if location is passed, it is not empty
        if (location != null && !(location.equals("Online") || location.equals("In-Person"))) {
            return new ResponseEntity<>("Location must be either 'Online' or 'In-Person'", HttpStatus.BAD_REQUEST);
        }

        // Verify if minPrice is passed, it is not negative
        if (minPrice != null && minPrice < 0) {
            return new ResponseEntity<>("Min Price must not be negative", HttpStatus.BAD_REQUEST);
        }

        // Verify if maxPrice is passed, it is not negative, and that it is greater than min price (if applicable)
        if ((maxPrice != null && maxPrice < 0) || (minPrice != null && maxPrice < minPrice)) {
            return new ResponseEntity<>("Max Price must not be negative and be greater than Min Price", HttpStatus.BAD_REQUEST);
        }
        
        List<PostingEntity> posting = postingService.getAllPosting();
        return new ResponseEntity<>(posting, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostingEntity> getPostingById(@PathVariable String id) {
        PostingEntity posting = postingService.getPostingById(id);
        if (posting != null) {
            return new ResponseEntity<>(posting, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPosting(HttpServletRequest request, @RequestBody PostingEntity posting) {
        try {

            String token = JWTAuthenticationFilter.getJWTFromRequest(request);
            String userID = jwt.getUserIdFromJWT(token);

            // Set tutor id from jwt
            posting.setTutorId(userID);

            PostingEntity createdPosting = postingService.createPosting(posting);
            
            // Verify location is either "Online" or "In-Person"
            if (!(posting.getLocation().equals("Online") || posting.getLocation().equals("In-Person"))) {
                return new ResponseEntity<>("Location must be either 'Online' or 'In-Person'", HttpStatus.BAD_REQUEST);
            }

            // Verify hourly rate is positive
            if (!(posting.getPricePerHour() > 0)) {
                return new ResponseEntity<>("Price per hour must be positive", HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(createdPosting, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Return BAD_REQUEST if Tutor doesn't exist.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostingEntity> updatePosting(@PathVariable String id, @RequestBody PostingEntity posting) {
        try {
            PostingEntity updatedPosting = postingService.updatePosting(id, posting);
            return new ResponseEntity<>(updatedPosting, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosting(@PathVariable String id) {
        postingService.deletePosting(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
