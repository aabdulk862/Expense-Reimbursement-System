package com.revature.services;

import com.revature.exceptions.UnauthorizedException;
import com.revature.models.DTOs.LoginRequest;
import com.revature.models.DTOs.OutgoingUserDTO;
import com.revature.models.User;
import com.revature.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Method to validate the user's credentials and return the user info
    public OutgoingUserDTO login(LoginRequest loginRequest) {
        // Find user by username
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        // Check if the password matches
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Map User entity to OutgoingUserDTO
        return new OutgoingUserDTO(user.getUserId(), user.getUsername(), user.getRole());
    }
}
