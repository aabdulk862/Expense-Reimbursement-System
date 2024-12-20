package com.revature.controllers;

import com.revature.aspects.AdminOnly;
import com.revature.models.DTOs.LoginRequest;
import com.revature.models.DTOs.RoleUpdateRequest;
import com.revature.models.User;
import com.revature.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(value = {"http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        // Register a new user
        User newUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    // Login endpoint using LoginRequest DTO
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        // Validate user credentials
        User user = userService.validateUser(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok("Logged in successfully. Welcome " + user.getUsername());
    }


    // Fetch all users (requires user to be logged in)
    @GetMapping
    @AdminOnly
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Delete a user (requires user to be logged in)
    @DeleteMapping("/delete/{userId}")
    @AdminOnly
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Update user role (requires user to be logged in)
    @PatchMapping("/update-role")
    @AdminOnly
    public ResponseEntity<String> updateUserRole(@RequestBody RoleUpdateRequest request) {
        userService.updateUserRole(request.getTargetUserId(), request.getNewRole());
        return ResponseEntity.ok("User role updated successfully");
    }

}
