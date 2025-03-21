package com.app.Dto;

import java.util.List;

import lombok.Data;

@Data
public class TutorDto {

    private String user_id;
    private List<String> student_id_list;
    private List<String> post_id_list;
    private List<String> review_id_list;

    public TutorDto() {}

}
