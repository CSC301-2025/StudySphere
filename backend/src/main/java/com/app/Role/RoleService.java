package com.app.Role;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository RoleRepository;

    public RoleService(RoleRepository RoleRepository) {
        this.RoleRepository = RoleRepository;
    }

    public List<Role> getAllRoles() {
        return RoleRepository.findAll();
    }

    public Role getRoleById(String id) {
        return RoleRepository.findById(id).orElse(null);
    }

    public Role saveRole(Role Role) {
        return RoleRepository.save(Role);
    }

    public void deleteRole(String id) {
        RoleRepository.deleteById(id);
    }
}