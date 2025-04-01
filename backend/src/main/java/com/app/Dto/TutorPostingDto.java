
package com.app.Dto;

import java.util.List;
import lombok.Data;

@Data
public class TutorPostingDto {
    private String id;
    private String tutorId;
    private String title;
    private List<String> coursesTaught;
    private String description;
    private String location;
    private double pricePerHour;
    private String contactEmail;
    private String university;
}
