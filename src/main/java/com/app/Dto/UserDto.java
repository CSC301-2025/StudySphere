package com.app.Dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private List<String> roles;

    public UserDto() {}
}
