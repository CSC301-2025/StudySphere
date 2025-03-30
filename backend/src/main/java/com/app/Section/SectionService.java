package com.app.Section;

import com.app.Dto.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;

    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    public List<SectionDto> getAllSections(String userID) {
        return sectionRepository.getSectionsByUserID(userID)
            .map(sectionEntities -> sectionEntities.stream()
                .map(this::toDTO) // assumes you have a toDTO(SectionEntity) method
                .collect(Collectors.toList()))
            .orElse(Collections.emptyList());
    }


    public SectionDto getSectionById(String userID, String id) {
        return sectionRepository.findByUserIDAndSectionId(userID, id)
            .map(this::toDTO)
            .orElse(null);
    }

    public SectionDto addSection(String userID, SectionDto sectionDto) {
        SectionEntity savedEntity = sectionRepository.save(toEntity(userID, sectionDto));
        return toDTO(savedEntity);
    }

    public SectionDto updateSection(String userID, SectionDto sectionDto) {
        Optional<SectionEntity> optional_Entity = sectionRepository.findByUserIDAndSectionId(userID, sectionDto.getSectionID());

        if (optional_Entity.isPresent()) {
            SectionEntity sectionEntity = optional_Entity.get();
            
            if (sectionDto.getSectionName() != null) {
                sectionEntity.setSectionName(sectionDto.getSectionName());
            }
            
            if (sectionDto.getSectionColour() != null) {
                sectionEntity.setSectionColour(sectionDto.getSectionColour());
            }
            
            return toDTO(sectionRepository.save(sectionEntity));
        } else {
            return new SectionDto();
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
            sectionDto.getSectionID(),
            userID,
            sectionDto.getSectionName(),
            sectionDto.getSectionColour()
        );

        return sectionEntity;
    }

    private SectionDto toDTO(SectionEntity sectionEntity) {
        return new SectionDto(
            sectionEntity.getSectionId(),
            sectionEntity.getSectionName(),
            sectionEntity.getSectionColour()
        );
    }

}
