package com.app.Section;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;

    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    public List<SectionEntity> getAllSections() {
        return sectionRepository.findAll();
    }

    public SectionEntity getSectionById(String id) {
        return sectionRepository.findById(id).orElse(null);
    }

    public SectionEntity addSection(SectionDto sectionDto) {
        return sectionRepository.save(toEntity(sectionDto));

    }

    public SectionEntity updateSection(SectionDto sectionDto) {
        Optional<SectionEntity> optional_Entity = sectionRepository.findById(sectionDto.getSection_id());

        if (optional_Entity.isPresent()) {
            SectionEntity sectionEntity = optional_Entity.get();
            
            if (sectionDto.getSection_name() != null) {
                sectionEntity.setSection_name(sectionDto.getSection_name());
            }
            
            if (sectionDto.getSection_colour() != null) {
                sectionEntity.setSection_colour(sectionDto.getSection_colour());
            }
            
            return sectionRepository.save(sectionEntity);
        } else {
            return new SectionEntity();
        }
    }

    public void deleteSection(String id) {
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
