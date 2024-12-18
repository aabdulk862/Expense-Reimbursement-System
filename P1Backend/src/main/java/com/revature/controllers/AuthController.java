package com.revature.controllers;

import com.revature.models.DTOs.LoginRequest;
import com.revature.models.DTOs.OutgoingUserDTO;
import com.revature.services.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    // Autowire the service
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login endpoint
    @PostMapping
    public ResponseEntity<OutgoingUserDTO> login(@RequestBody LoginRequest loginRequest, HttpSession session) {

        // Send the loginDTO to the service for validation
        OutgoingUserDTO user = authService.login(loginRequest);

        // If login is successful, create a session
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("role", user.getRole());

        System.out.println("User " + user.getUsername() + " logged in!");

        // Return the user info to the client
        return ResponseEntity.ok(user);
    }

}
