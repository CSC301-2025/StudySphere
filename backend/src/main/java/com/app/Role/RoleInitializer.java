package com.app.Role;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoleInitializer implements CommandLineRunner {

    private final RoleService roleService;

    public RoleInitializer(RoleService roleService) {
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Get all roles
        List<Role> roles = roleService.getAllRoles();

        // Check if the "USER" role exists
        boolean userRoleExists = roles.stream().anyMatch(role -> "USER".equals(role.getName()));
        if (!userRoleExists) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleService.saveRole(userRole);
            System.out.println("Created role: USER");
        }
        
        // Create "ADMIN" role if it doesn't exist
        boolean adminRoleExists = roles.stream().anyMatch(role -> "ADMIN".equals(role.getName()));
        if (!adminRoleExists) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleService.saveRole(adminRole);
            System.out.println("Created role: ADMIN");
        }
    }
}
