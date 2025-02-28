package com.app.Section;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<SectionEntity> getAllSections() {
        return sectionService.getAllSections();
    }

    // get request to get a section by id
    @GetMapping("/{id}")
    public SectionEntity getSectionById(@PathVariable Long id) {
        return sectionService.getSectionById(id);
    }

    // post request to add a section
    @PostMapping
    public ResponseEntity<SectionEntity> addSection(@RequestBody SectionDto sectionDto) {
        return new ResponseEntity<>(sectionService.addSection(sectionDto), HttpStatus.CREATED);
    }

    // put request to update a section
    @PutMapping
    public ResponseEntity<SectionEntity> updateSection(@RequestBody SectionDto sectionDto) {
        return new ResponseEntity<>(sectionService.updateSection(sectionDto), HttpStatus.OK);
    }

    // delete request to delete a section
    @DeleteMapping("/{id}")
    public void deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
    }

}
