package com.app.Dto;

import lombok.Data;
import java.util.Date;

@Data
public class AssignmentDto {

    private String id;
    
    private String name;
    
    private String description;
    
    private Date dueDate;
    
    // true for recurring, false for non-recurring
    private boolean recurring;
    
    public AssignmentDto() {}
}
