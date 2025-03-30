package com.app.security;

import com.app.User.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User Not Found"));
    }

    public UserDetails loadUserById(String id) throws UsernameNotFoundException {
        return userRepository.findById(id).orElseThrow(() ->
                new UsernameNotFoundException("User not found with id: " + id));
    }
}
