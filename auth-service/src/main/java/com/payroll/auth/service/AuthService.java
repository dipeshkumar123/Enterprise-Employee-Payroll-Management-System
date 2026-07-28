package com.payroll.auth.service;

import com.payroll.auth.dto.AuthRequest;
import com.payroll.auth.dto.AuthResponse;
import com.payroll.auth.dto.RegisterRequest;
import com.payroll.auth.entity.Role;
import com.payroll.auth.entity.User;
import com.payroll.auth.exception.InvalidCredentialsException;
import com.payroll.auth.repository.RoleRepository;
import com.payroll.auth.repository.UserRepository;
import com.payroll.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        Role employeeRole = roleRepository.findByName("EMPLOYEE")
                .orElseGet(() -> roleRepository.save(new Role(null, "EMPLOYEE")));
        user.setRoles(Set.of(employeeRole));
        userRepository.save(user);
        provisionEmployeeProfile(user);

        List<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        String token = jwtUtil.generateToken(user.getUsername(), roleNames);

        return new AuthResponse(token, user.getUsername(), roleNames);
    }

    public AuthResponse login(AuthRequest request) {
        try {
            User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                List<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
                String token = jwtUtil.generateToken(user.getUsername(), roleNames);
                return new AuthResponse(token, user.getUsername(), roleNames);
            } else {
                throw new InvalidCredentialsException("Invalid username or password");
            }
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }

    public void changePassword(String username, com.payroll.auth.dto.ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private void provisionEmployeeProfile(User user) {
        Map<String, Object> profile = Map.of(
                "authUsername", user.getUsername(),
                "name", user.getUsername(),
                "email", user.getEmail(),
                "joiningDate", LocalDate.now().toString(),
                "status", "ACTIVE",
                "baseSalary", BigDecimal.ZERO
        );
        try {
            new RestTemplate().postForEntity(
                    System.getenv().getOrDefault("EMPLOYEE_SERVICE_URL", "http://employee-service:8082") + "/employees/provision",
                    profile, Void.class);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to create the employee profile. Please try again.");
        }
    }
}
