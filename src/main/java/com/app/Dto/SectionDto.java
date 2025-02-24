package com.app.Dto;

import lombok.Data;
import java.util.List;

@Data
public class SectionDto {

    private Long section_id;
    private String section_name;
    private String section_colour; // TODO: should not be a string?
    // TODO: should there be a section description?

    public SectionDto() {
    }

}
