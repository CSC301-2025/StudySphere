package com.app.Section;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
public class SectionEntity {
    @Id
    private String sectionId;
    private String userID;
    private String sectionName;
    private String sectionColour;

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String section_name) {
        this.sectionName = section_name;
    }

    public String getSectionColour() {
        return sectionColour;
    }

    public void setSectionColour(String section_colour) {
        this.sectionColour = section_colour;
    }

    // constructor
    public SectionEntity(String sectionId, String userID, String section_name, String section_colour) {
        this.sectionId = sectionId;
        this.userID = userID;
        this.sectionName = section_name;
        this.sectionColour = section_colour;
    }
}
