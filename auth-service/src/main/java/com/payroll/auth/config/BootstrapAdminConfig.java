package com.payroll.auth.config;

import com.payroll.auth.entity.Role;
import com.payroll.auth.entity.User;
import com.payroll.auth.repository.RoleRepository;
import com.payroll.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class BootstrapAdminConfig {

    @Bean
    CommandLineRunner bootstrapAdmin(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.username:}") String username,
            @Value("${app.bootstrap-admin.email:}") String email,
            @Value("${app.bootstrap-admin.password:}") String password,
            @Value("${app.bootstrap-admin.reset-password:false}") boolean resetPassword
    ) {
        return args -> {
            if (username.isBlank() || email.isBlank() || password.isBlank()) {
                return;
            }

            Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));
            User admin = userRepository.findByUsername(username).orElseGet(User::new);
            if (admin.getId() != null && !resetPassword) {
                return;
            }
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setActive(true);
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        };
    }
}
