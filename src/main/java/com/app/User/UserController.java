package com.app.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import com.app.Dto.*;

import java.util.List;

@RestController
@RequestMapping("api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserEntity getUser(@PathVariable Long id) { // @PathVariable extracts id from the url
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody RegisterDto registerDto) {

        UserEntity user = userService.saveUser(registerDto);

        // User Created
        if (user != null) {
            return new ResponseEntity<>("User Created", HttpStatus.OK);
        }
        // User already Exists
        return new ResponseEntity<>("User already exists. Please sign in.", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        try {
            return new ResponseEntity<>(userService.authenticateUser(loginDto), HttpStatus.OK);

        } catch (AuthenticationException ex) {
            if (ex instanceof BadCredentialsException) {
                return new ResponseEntity<>(new AuthResponseDto("Email or password is incorrect.", null,null),
                        HttpStatus.UNAUTHORIZED);
            } else {
                return new ResponseEntity<>(new AuthResponseDto("An error occurred during authentication. Please Try again", null, null),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @PostMapping("/validateTokens")
    public ResponseEntity<AuthResponseDto> validateTokens(@RequestBody TokenDto dto) {
        try {
            // Validate Both tokens
            AuthResponseDto tokens = userService.validateTokens(dto.getAccessToken(), dto.getRefreshToken());

            // Tokens valid, return them
            return new ResponseEntity<>(tokens, HttpStatus.OK);
        } catch (Exception e) { // Refresh Token invalid, user must sign in again
            return new ResponseEntity<>(new AuthResponseDto("Could not Authorize, Please sign in.",
                    null, null) ,HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody RegisterDto registerDto) {
        return null;
    }


    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
