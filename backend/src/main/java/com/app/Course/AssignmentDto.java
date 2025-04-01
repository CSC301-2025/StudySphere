
package com.app.Course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDto {
    private String id;
    private String title;
    private String description;
    private String dueDate;
    private boolean submitted;
    private String courseName;
    private boolean isRecurring;
    private String recurrencePattern;
    private String recurrenceEndDate;
}
