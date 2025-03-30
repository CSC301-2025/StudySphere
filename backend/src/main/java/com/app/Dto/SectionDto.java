package com.app.Dto;

import lombok.Data;

@Data
public class SectionDto {
    private String sectionID;
    private String sectionName;
    private String sectionColour; // TODO: should not be a string?
    // TODO: should there be a section description?

    public SectionDto() {
    }

    public SectionDto(String sectionID, String sectionName, String sectionColour) {
        this.sectionID = sectionID;
        this.sectionName = sectionName;
        this.sectionColour = sectionColour;
    }
    
}
