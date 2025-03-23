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

    public List<SectionEntity> getAllSections(String userID) {
        return sectionRepository.getSectionsByUserID(userID).orElse(null);
    }

    public SectionEntity getSectionById(String userID, String id) {
        return sectionRepository.findByUserIDAndSectionId(userID, id).orElse(null);
    }

    public SectionEntity addSection(String userID, SectionDto sectionDto) {
        return sectionRepository.save(toEntity(userID, sectionDto));
    }

    public SectionEntity updateSection(String userID, SectionDto sectionDto) {
        Optional<SectionEntity> optional_Entity = sectionRepository.findByUserIDAndSectionId(userID, sectionDto.getSection_id());

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

    public void deleteSection(String userID, String id) {
        Optional<SectionEntity> optional_Entity = sectionRepository.findByUserIDAndSectionId(userID, id);
        if (optional_Entity.isPresent()) {
            SectionEntity sectionEntity = optional_Entity.get();
            sectionRepository.delete(sectionEntity);
        }
    }

    private SectionEntity toEntity(String userID, SectionDto sectionDto) {
        SectionEntity sectionEntity = new SectionEntity(
            sectionDto.getSection_id(),
            userID,
            sectionDto.getSection_name(),
            sectionDto.getSection_colour()
        );

        return sectionEntity;
    }

}
