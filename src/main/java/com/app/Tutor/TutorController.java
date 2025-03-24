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

    // get request to get all tutors
    @GetMapping
    public List<TutorEntity> getAllTutors() {
        return tutorService.getAllTutors();
    }

    // get request to get a tutor by id
    @GetMapping("/{id}")
    public TutorEntity getTutorById(@PathVariable String id) {
        return tutorService.getTutorById(id);
    }

    // post request to add a tutor
    @PostMapping
    public ResponseEntity<TutorEntity> addTutor(HttpServletRequest request, @RequestBody TutorDto tutorDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(tutorService.addTutor(userID, tutorDto), HttpStatus.CREATED);
    }

    // put request to update a tutor
    @PatchMapping
    public ResponseEntity<TutorEntity> updateTutor(HttpServletRequest request, @RequestBody TutorDto tutorDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(tutorService.updateTutor(userID, tutorDto), HttpStatus.OK);
    }

    // delete request to delete a tutor based on the userID passed in the token
    @DeleteMapping()
    public void deleteTutor(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        tutorService.deleteTutor(userID);
    }

}
