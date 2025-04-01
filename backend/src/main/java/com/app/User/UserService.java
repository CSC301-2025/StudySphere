package com.app.User;

import com.app.Dto.*;
import com.app.security.JWTGenerator;
import com.app.Role.Role;
import com.app.Role.RoleRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTGenerator jwtGenerator;

    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /*
        Converts a UserEntity to a UserDto that is returned to the client as a response.
    */
    public UserDto convertToDto(UserEntity user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList())); // Convert Role to Strings
        return dto;
    }

    private boolean isPasswordStrong(String password) {

        String pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$";
        return password != null && Pattern.matches(pattern, password);
    }

    /*
     * Saves a new user to the database.
     */
    public UserEntity saveUser(RegisterDto registerDto) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new IllegalArgumentException("A user with this email already exists.");
        }
        
        // Validate password quality before proceeding
        if (!isPasswordStrong(registerDto.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, and one number.");
        }
        
        // Create a new user entity
        UserEntity user = new UserEntity(
            registerDto.getFirstName(),
            registerDto.getLastName(),
            registerDto.getEmail(),
            registerDto.getPhoneNumber(),
            passwordEncoder.encode(registerDto.getPassword()),
            registerDto.getRecoveryEmail()
        );
        
        // Retrieve the role and assign it
        Role role = roleRepository.findByName("USER")
            .orElseThrow(() -> new RuntimeException("Role USER not found"));
        user.setRoles(Collections.singletonList(role));
        
        return userRepository.save(user);
    }

    public AuthResponseDto authenticateUser(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        UserEntity user = (UserEntity) authentication.getPrincipal();
        String userId = user.getId();
        System.out.println("User ID: " + userId);

        String refreshToken = jwtGenerator.generateRefreshToken(authentication);
        String accessToken = jwtGenerator.generateAccessToken(userId);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Getting the user
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        UserDto userDto = convertToDto(userOptional.get());

        return new AuthResponseDto(accessToken, refreshToken, userDto);
    }

    public AuthResponseDto validateTokens(String accessToken, String refreshToken) {

        // Validate refresh Token, throws error if token not valid
        jwtGenerator.validateToken(refreshToken);
        Optional<UserEntity> user = userRepository.findById(jwtGenerator.getUserIdFromJWT(accessToken));
        UserDto userDto = convertToDto(user.get());

        try { // Validate Access Token
            jwtGenerator.validateToken(accessToken);
            // Both Tokens valid, user is authenticated
            return new AuthResponseDto(accessToken, refreshToken, userDto);
        } catch (Exception e) { // Access token invalid, create new one using refresh token
            String newToken = jwtGenerator.generateAccessToken(jwtGenerator.getUserIdFromJWT(refreshToken));

            return new AuthResponseDto(newToken, refreshToken, userDto);
        }
    }

    public AuthResponseDto refreshAccessToken(String refreshToken) {
        // Validate the refresh token
        jwtGenerator.validateToken(refreshToken);
    
        String userId = jwtGenerator.getUserIdFromJWT(refreshToken);
    
        // Retrieve the user
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        UserDto userDto = convertToDto(userOpt.get());
    
        // Generate a new access token
        String newAccessToken = jwtGenerator.generateAccessToken(userId);
    
        return new AuthResponseDto(newAccessToken, refreshToken, userDto);
    }
    
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
