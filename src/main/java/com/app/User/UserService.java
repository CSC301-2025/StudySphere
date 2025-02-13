package com.app.User;

import com.app.Dto.*;
import com.app.security.JWTGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    private final JWTGenerator jwtGenerator;

    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /* 
        Converts a UserEntity to a UserDto that is returned to the client as a response.
    */
    public UserDto convertToDto(UserEntity user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }

    /*
     * Saves a new user to the database.
     */
    public UserEntity saveUser(RegisterDto registerDto) {

        // User already exists
        if (userRepository.existsByUsername(registerDto.getEmail())) {
            return null;
        }

        // Create a new user
        UserEntity user = new UserEntity(
            registerDto.getFirstName(),
            registerDto.getLastName(),
            registerDto.getEmail(),
            registerDto.getPhoneNumber(),
            passwordEncoder.encode(registerDto.getPassword()),
            registerDto.getRecoveryEmail()
    );

        return userRepository.save(user);
    }

    public AuthResponseDto authenticateUser(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        String refreshToken = jwtGenerator.generateRefreshToken(authentication);
        String accessToken = jwtGenerator.generateAccessToken(refreshToken, loginDto.getEmail());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Getting the user
        Optional<UserEntity> user = userRepository.findByUsername(loginDto.getEmail());
        UserDto userDto = convertToDto(user.get());

        return new AuthResponseDto(accessToken, refreshToken, userDto);
    }

    public AuthResponseDto validateTokens(String accessToken, String refreshToken) {

            // Validate refresh Token, throws error if token not valid
            jwtGenerator.validateToken(refreshToken);
            Optional<UserEntity> user = userRepository.findByUsername(jwtGenerator.getUsernameFromJWT(accessToken));
            UserDto userDto = convertToDto(user.get());

        try { // Validate Access Token
            jwtGenerator.validateToken(accessToken);
            // Both Tokens valid, user is authenticated
            return new AuthResponseDto(accessToken, refreshToken, userDto);
        }
        catch(Exception e) { // Access token invalid, create new one using refresh token
            String newToken = jwtGenerator.generateAccessToken(refreshToken,
                    jwtGenerator.getUsernameFromJWT(refreshToken));

            return new AuthResponseDto(newToken, refreshToken, userDto);
        }
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}