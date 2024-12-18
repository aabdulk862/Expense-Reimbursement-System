package com.revature.controllers;

import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.ResourceNotFoundException;
import com.revature.exceptions.UnauthorizedException;
import com.revature.models.DTOs.LoginRequest;
import com.revature.models.DTOs.RoleUpdateRequest;
import com.revature.models.User;
import com.revature.services.SessionManager;
import com.revature.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final SessionManager sessionManager;

    @Autowired
    public UserController(UserService userService, SessionManager sessionManager) {
        this.userService = userService;
        this.sessionManager = sessionManager;
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User newUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    // Login endpoint using LoginRequest DTO
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.validateUser(loginRequest.getUsername(), loginRequest.getPassword());
        String sessionToken = sessionManager.createSession(user);
        return ResponseEntity.ok("Logged in successfully. Session Token: " + sessionToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Session-Token") String sessionToken) {
        String result = userService.logout(sessionToken);
        return ResponseEntity.ok(result);
    }

    // Fetch all users (requires Session Token)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Session-Token") String sessionToken) {
        User currentUser = sessionManager.validateSession(sessionToken);
        List<User> users = userService.getAllUsers(currentUser);
        return ResponseEntity.ok(users);
    }

    // Delete a user (requires Session Token)
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId,
                                             @RequestHeader("Session-Token") String sessionToken) {
        User currentUser = sessionManager.validateSession(sessionToken);
        userService.deleteUser(userId, currentUser);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Update user role (requires Session Token)
    @PatchMapping("/update-role")
    public ResponseEntity<String> updateUserRole(@RequestBody RoleUpdateRequest request,
                                                 @RequestHeader("Session-Token") String sessionToken) {
        User currentUser = sessionManager.validateSession(sessionToken);
        userService.updateUserRole(request.getTargetUserId(), request.getNewRole(), currentUser);
        return ResponseEntity.ok("User role updated successfully");
    }

    // Exception Handlers
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequest(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorized(UnauthorizedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}
