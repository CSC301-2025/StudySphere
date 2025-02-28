package com.app.Dto;

import lombok.Data;

@Data
public class SectionDto {

    private String section_id;
    private String section_name;
    private String section_colour; // TODO: should not be a string?
    // TODO: should there be a section description?

    public SectionDto() {
    }

}
