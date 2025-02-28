package com.app.Section;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;

    public List<SectionEntity> getAllSections() {
        return sectionRepository.findAll();
    }

    public SectionEntity getSectionById(Long id) {
        return sectionRepository.findById(id).orElse(null);
    }

    public SectionEntity addSection(SectionDto sectionDto) {
        return sectionRepository.save(toEntity(sectionDto));

    }

    public SectionEntity updateSection(SectionDto sectionDto) {
        Optional<SectionEntity> optional_Entity = sectionRepository.findById(sectionDto.getSection_id());

        if (optional_Entity.isPresent()) {
            return sectionRepository.save(toEntity(sectionDto));
        } else {
            return new SectionEntity();
        }
    }

    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }

    private SectionEntity toEntity(SectionDto sectionDto) {
        SectionEntity sectionEntity = new SectionEntity(
            sectionDto.getSection_id(),
            sectionDto.getSection_name(),
            sectionDto.getSection_colour()
        );

        return sectionEntity;
    }

}
