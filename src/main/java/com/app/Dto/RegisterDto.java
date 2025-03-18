package com.app.Dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RegisterDto {

    @NotBlank(message = "First name is required.")
    private String firstName;
    
    @NotBlank(message = "Last name is required.")
    private String lastName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    private String phoneNumber;

    @Email(message = "Invalid recovery email format.")
    private String recoveryEmail;
}
