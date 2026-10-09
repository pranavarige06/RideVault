package com.ridevault.RideVault.controller;

import com.ridevault.RideVault.entity.User;
import com.ridevault.RideVault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser == null) {
            return "User not found";
        }

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }
}