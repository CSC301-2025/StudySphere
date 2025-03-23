package com.app.Section;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;
import com.app.security.JWTGenerator;

import java.util.List;

@RestController
@RequestMapping("api/Section")
public class SectionController {
    private final SectionService sectionService;

    // JWT Generator
    JWTGenerator jwt;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
        this.jwt = new JWTGenerator();
    }

    // get request to get all sections for that user
    @GetMapping
    public List<SectionEntity> getAllSections(@RequestHeader("Authorization") String token) {
        String userID = jwt.getUserIdFromJWT(token);
        return sectionService.getAllSections(userID);
    }

    // get request to get a section by id
    @GetMapping("/{id}")
    public SectionEntity getSectionById(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userID = jwt.getUserIdFromJWT(token);
        return sectionService.getSectionById(userID, id);
    }

    // post request to add a section
    @PostMapping
    public ResponseEntity<SectionEntity> addSection(@RequestHeader("Authorization") String token, @RequestBody SectionDto sectionDto) {
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(sectionService.addSection(userID, sectionDto), HttpStatus.CREATED);
    }

    // put request to update a section
    @PatchMapping
    public ResponseEntity<SectionEntity> updateSection(@RequestHeader("Authorization") String token, @RequestBody SectionDto sectionDto) {
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(sectionService.updateSection(userID, sectionDto), HttpStatus.OK);
    }

    // delete request to delete a section
    @DeleteMapping("/{id}")
    public void deleteSection(@RequestHeader("Authorization") String token, @PathVariable String id) {
        String userID = jwt.getUserIdFromJWT(token);
        sectionService.deleteSection(userID, id);
    }

}
