package com.app.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> dtos = userService.getAllUsers().stream()
            .map(userService::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved", dtos));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable String id) {
        System.out.println(3453);
        UserEntity user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "User found", userService.convertToDto(user)));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "User not found", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
    // Get the user from the security context
    UserEntity user = (UserEntity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if(user != null){
        return ResponseEntity.ok(new ApiResponse<>(true, "User found", userService.convertToDto(user)));
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse<>(false, "User not found", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> createUser(@Valid @RequestBody RegisterDto registerDto) {
        try {
            userService.saveUser(registerDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "User Created", null));
        } catch (IllegalArgumentException ex) { // User already exists
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred during registration.", null));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody LoginDto loginDto) {
        try {
            AuthResponseDto authResponse = userService.authenticateUser(loginDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Login Successful", authResponse));
        } catch (AuthenticationException ex) {
            if (ex instanceof BadCredentialsException) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Email or password is incorrect.", null));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse<>(false, "An error occurred during authentication. Please try again.", null));
            }
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
        try {
            // Get the user from the security context to check authorization
            UserEntity currentUser = (UserEntity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            // Ensure the user is updating their own record
            if (!currentUser.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "You can only update your own profile", null));
            }
            
            // Update the user
            UserEntity updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "User updated successfully", userService.convertToDto(updatedUser)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating user: " + e.getMessage(), null));
        }
    }

    @PostMapping("/validateTokens")
    public ResponseEntity<ApiResponse<AuthResponseDto>> validateTokens(@RequestBody TokenDto dto) {
        System.out.println(12345);
        try {
            AuthResponseDto tokens = userService.validateTokens(dto.getAccessToken(), dto.getRefreshToken());
            return ResponseEntity.ok(new ApiResponse<>(true, "Tokens valid", tokens));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Could not authorize, please sign in.", null));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refreshAccessToken(@RequestBody TokenDto tokenDto) {
        try {
            // Use only the refresh token from the DTO to generate a new access token.
            AuthResponseDto authResponse = userService.refreshAccessToken(tokenDto.getRefreshToken());
            return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed", authResponse));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid refresh token", null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted", null));
    }
}
