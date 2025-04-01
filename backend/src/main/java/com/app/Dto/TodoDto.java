package com.app.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TodoDto {
    
    private String id;
    private String userID;
    private String description;
    private String sectionID;
    private boolean completed;
    private LocalDateTime dueDate;
}
