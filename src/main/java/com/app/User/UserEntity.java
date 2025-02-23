package com.app.User;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Document
@Data
@NoArgsConstructor
public class UserEntity implements UserDetails {

    @Id
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    private String phoneNumber;

    private String password;

    private String recoveryEmail;

        // Relationships
        // @OneToMany(mappedBy = "user")
        // private List<Section> sections = new ArrayList<>();
    
        // @OneToMany(mappedBy = "user")
        // private List<Review> reviews = new ArrayList<>();

    // Constructor without explicit roles
    public UserEntity(String firstName, String lastName, String email, String phoneNumber, String password, String recoveryEmail) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getUsername() {  // Return email instead of username
        return this.email;
    }

    public String getName() {
        return this.firstName + " " + this.lastName;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}