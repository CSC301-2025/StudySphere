
package com.app.Dto;

import java.util.List;
import lombok.Data;

@Data
public class TutorProfileDto {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String university;
    private String bio;
    private List<String> expertise;
    private String createdAt;
}
