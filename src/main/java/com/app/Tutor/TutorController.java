package com.app.Tutor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;
import com.app.security.JWTGenerator;

import java.util.List;

@RestController
@RequestMapping("api/Tutor")
public class TutorController {
    private final TutorService tutorService;
    JWTGenerator jwt;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
        this.jwt = new JWTGenerator();
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
    public ResponseEntity<TutorEntity> addTutor(@RequestHeader("Authorization") String token, @RequestBody TutorDto tutorDto) {
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(tutorService.addTutor(userID, tutorDto), HttpStatus.CREATED);
    }

    // put request to update a tutor
    @PatchMapping
    public ResponseEntity<TutorEntity> updateTutor(@RequestHeader("Authorization") String token, @RequestBody TutorDto tutorDto) {
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(tutorService.updateTutor(userID, tutorDto), HttpStatus.OK);
    }

    // delete request to delete a tutor based on the userID passed in the token
    @DeleteMapping()
    public void deleteTutor(@RequestHeader("Authorization") String token) {
        String userID = jwt.getUserIdFromJWT(token);
        tutorService.deleteTutor(userID);
    }

}
