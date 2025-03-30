package com.app.Dto;

import lombok.Data;

@Data
public class AuthResponseDto {

    private String accessToken;

    private String refreshToken;

    private UserDto userDto;

    private String tokenType = "Bearer";

    public AuthResponseDto(String accessToken, String refreshToken, UserDto userDto) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userDto = userDto;
    }
}
