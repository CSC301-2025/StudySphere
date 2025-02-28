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
    private String section_id;
    private String section_name;
    private String section_colour;

    public String getSection_id() {
        return section_id;
    }

    public void setSection_id(String section_id) {
        this.section_id = section_id;
    }

    public String getSection_name() {
        return section_name;
    }

    public void setSection_name(String section_name) {
        this.section_name = section_name;
    }

    public String getSection_colour() {
        return section_colour;
    }

    public void setSection_colour(String section_colour) {
        this.section_colour = section_colour;
    }

    // constructor
    public SectionEntity(String section_id, String section_name, String section_colour) {
        this.section_id = section_id;
        this.section_name = section_name;
        this.section_colour = section_colour;
    }
}
