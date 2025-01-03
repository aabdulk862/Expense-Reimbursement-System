package com.revature.services;

import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.ConflictException;
import com.revature.exceptions.ResourceNotFoundException;
import com.revature.exceptions.UnauthorizedException;
import com.revature.models.User;
import com.revature.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create a new user
    public User createUser(User user) {
        // Check if the username is not blank
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new BadRequestException("Username cannot be blank");
        }

        // Check if the password is at least 4 characters long
        if (user.getPassword() == null || user.getPassword().length() < 4) {
            throw new BadRequestException("Password must be at least 4 characters long");
        }

        // Check if the username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new ConflictException("Username already exists");
        }

        // Save the user to the database
        return userRepository.save(user);
    }

    // Validate user login credentials
    public User validateUser(String username, String password) {
        // Find user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        // Check if the password matches
        if (!user.getPassword().equals(password)) {
            throw new UnauthorizedException("Invalid username or password");
        }

        return user;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete a user by ID
    public void deleteUser(int targetUserId) {
        // Verify if the target user exists
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + targetUserId));

        // Delete the user
        userRepository.delete(targetUser);
    }

    // Update user role (if needed in the future)
    public void updateUserRole(int userId, String newRole) {
        // Only allow valid roles for the user
        if (!"EMPLOYEE".equalsIgnoreCase(newRole) && !"MANAGER".equalsIgnoreCase(newRole)) {
            throw new BadRequestException("Invalid role. Allowed roles are EMPLOYEE and MANAGER.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setRole(newRole);
        userRepository.save(user);
    }

    // Find user by ID
    public Optional<User> findById(int userId) {
        return userRepository.findById(userId);
    }
}
