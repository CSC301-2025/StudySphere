package com.app.User;

import com.app.Dto.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}