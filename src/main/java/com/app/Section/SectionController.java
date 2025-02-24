package com.app.Section;

import com.app.Section.SectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;

import java.util.List;

@RestController
@RequestMapping("api/Section")
public class SectionController {
    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;

    }

    // get request to get all sections
    @GetMapping
    public List<SectionDto> getAllSections() {
        // pass
        // return sectionService.getAllSections();
        return null; // TODO: not done yet
    }

    // get request to get a section by id
    @GetMapping("/{id}")
    public SectionDto getSectionById(@PathVariable Long id) {
        // pass
        // return sectionService.getSectionById(id);
        return null; // TODO: not done yet
    }

    // post request to add a section
    @PostMapping
    public ResponseEntity<SectionDto> addSection(@RequestBody SectionDto sectionDto) {
        // pass
        // return new ResponseEntity<>(sectionService.addSection(sectionDto), HttpStatus.CREATED);
        return null; // TODO: not done yet
    }

    // put request to update a section
    @PutMapping
    public ResponseEntity<SectionDto> updateSection(@RequestBody SectionDto sectionDto) {
        // pass
        // return new ResponseEntity<>(sectionService.updateSection(sectionDto), HttpStatus.OK);
        return null; // TODO: not done yet
    }

    // delete request to delete a section
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        // pass
        // sectionService.deleteSection(id);
        return null; // TODO: not done yet
    }

}
