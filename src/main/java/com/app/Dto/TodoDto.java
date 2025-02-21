package com.app.Dto;

import lombok.Data;

@Data
public class TodoDto {
    
    private Long id;
    private String description;
    private String sectionID;
    private boolean completed;
}
