package com.app.User;

import com.app.Role.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Document
@Data
@NoArgsConstructor
public class UserEntity implements UserDetails {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    // Use @Indexed(unique = true) to enforce a unique index on 'email' in Mongo
    @Indexed(unique = true)
    private String email;

    private String phoneNumber;

    private String password;

    private String recoveryEmail;

    // Use @DBRef for referencing a separate 'Role' collection
    @DBRef
    private List<Role> roles;

    // Constructor with roles
    public UserEntity(String firstName, String lastName, String email,
                      String phoneNumber, String password, List<Role> roles,
                      List<String> universities, String recoveryEmail) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.roles = roles;
        this.recoveryEmail = recoveryEmail;
    }

    // Constructor without explicit roles
    public UserEntity(String firstName, String lastName, String email,
                      String phoneNumber, String password, String recoveryEmail) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.recoveryEmail = recoveryEmail;
    }

    // === UserDetails Implementation Methods ===

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority(role.getName()))
            .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {  // Return email instead of a traditional username
        return this.email;
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

    public String getName() {
        return this.firstName + " " + this.lastName;
    }
}
