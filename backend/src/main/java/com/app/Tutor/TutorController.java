
package com.app.Tutor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;
import com.app.security.JWTAuthenticationFilter;
import com.app.security.JWTGenerator;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("api/Tutor")
public class TutorController {
    private final TutorService tutorService;
    JWTGenerator jwt;

    public TutorController(TutorService tutorService, JWTGenerator jwt) {
        this.tutorService = tutorService;
        this.jwt = jwt;
    }

    // Original tutor endpoints
    @GetMapping
    public List<TutorEntity> getAllTutors() {
        return tutorService.getAllTutors();
    }

    @GetMapping("/{id}")
    public TutorEntity getTutorById(@PathVariable String id) {
        return tutorService.getTutorById(id);
    }

    @PostMapping
    public ResponseEntity<TutorEntity> addTutor(HttpServletRequest request, @RequestBody TutorDto tutorDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(tutorService.addTutor(userID, tutorDto), HttpStatus.CREATED);
    }

    @PatchMapping
    public ResponseEntity<TutorEntity> updateTutor(HttpServletRequest request, @RequestBody TutorDto tutorDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(tutorService.updateTutor(userID, tutorDto), HttpStatus.OK);
    }

    @DeleteMapping()
    public void deleteTutor(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        tutorService.deleteTutor(userID);
    }
    
    // Tutor Profile endpoints
    
    @PostMapping("/profile")
    public ResponseEntity<TutorProfileDto> createTutorProfile(
            HttpServletRequest request, 
            @RequestBody TutorProfileDto profileDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        try {
            TutorProfileDto createdProfile = tutorService.createTutorProfile(userID, profileDto);
            return new ResponseEntity<>(createdProfile, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<TutorProfileDto> getTutorProfile(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        TutorProfileDto profile = tutorService.getTutorProfileByUserId(userID);
        if (profile != null) {
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<TutorProfileDto> getTutorProfileByUserId(@PathVariable String userId) {
        TutorProfileDto profile = tutorService.getTutorProfileByUserId(userId);
        if (profile != null) {
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PatchMapping("/profile")
    public ResponseEntity<TutorProfileDto> updateTutorProfile(
            HttpServletRequest request, 
            @RequestBody TutorProfileDto profileDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        try {
            TutorProfileDto updatedProfile = tutorService.updateTutorProfile(userID, profileDto);
            return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Tutor Posting endpoints
    
    @PostMapping("/posting")
    public ResponseEntity<TutorPostingDto> createTutorPosting(
            HttpServletRequest request, 
            @RequestBody TutorPostingDto postingDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        try {
            TutorPostingDto createdPosting = tutorService.createTutorPosting(userID, postingDto);
            return new ResponseEntity<>(createdPosting, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/posting")
    public List<TutorPostingDto> getAllTutorPostings() {
        return tutorService.getAllTutorPostings();
    }
    
    @GetMapping("/posting/{id}")
    public ResponseEntity<TutorPostingDto> getTutorPostingById(@PathVariable String id) {
        TutorPostingDto posting = tutorService.getTutorPostingById(id);
        if (posting != null) {
            return new ResponseEntity<>(posting, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/posting/user")
    public List<TutorPostingDto> getCurrentUserTutorPostings(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        
        return tutorService.getTutorPostingsByUserId(userID);
    }
    
    @PostMapping("/posting/filter")
    public List<TutorPostingDto> filterTutorPostings(@RequestBody TutorFilterDto filterDto) {
        return tutorService.filterTutorPostings(filterDto);
    }
}
