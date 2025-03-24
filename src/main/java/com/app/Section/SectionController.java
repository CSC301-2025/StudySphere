package com.app.Section;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;
import com.app.security.JWTGenerator;

import jakarta.servlet.http.HttpServletRequest;

import com.app.security.JWTAuthenticationFilter;


import java.util.List;

@RestController
@RequestMapping("api/Section")
public class SectionController {
    private final SectionService sectionService;

    // JWT Generator
    JWTGenerator jwt;

    public SectionController(SectionService sectionService, JWTGenerator jwt) {
        this.sectionService = sectionService;
        this.jwt = jwt;
    }

    // get request to get all sections for that user
    @GetMapping
    public List<SectionEntity> getAllSections(HttpServletRequest request) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return sectionService.getAllSections(userID);
    }

    // get request to get a section by id
    @GetMapping("/{id}")
    public SectionEntity getSectionById(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return sectionService.getSectionById(userID, id);
    }

    // post request to add a section
    @PostMapping
    public ResponseEntity<SectionEntity> addSection(HttpServletRequest request, @RequestBody SectionDto sectionDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(sectionService.addSection(userID, sectionDto), HttpStatus.CREATED);
    }

    // put request to update a section
    @PatchMapping
    public ResponseEntity<SectionEntity> updateSection(HttpServletRequest request, @RequestBody SectionDto sectionDto) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        return new ResponseEntity<>(sectionService.updateSection(userID, sectionDto), HttpStatus.OK);
    }

    // delete request to delete a section
    @DeleteMapping("/{id}")
    public void deleteSection(HttpServletRequest request, @PathVariable String id) {
        String token = JWTAuthenticationFilter.getJWTFromRequest(request);
        String userID = jwt.getUserIdFromJWT(token);
        sectionService.deleteSection(userID, id);
    }

}
