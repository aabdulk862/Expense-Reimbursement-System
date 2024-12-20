package com.revature.controllers;

import com.revature.models.DTOs.LoginRequest;
import com.revature.models.DTOs.OutgoingUserDTO;
import com.revature.services.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@RestController
@RequestMapping("/auth")
@CrossOrigin(value = {"http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    // Autowire the service
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login endpoint
    @PostMapping("/login")
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

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Retrieve the current HTTP session
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession(false);

        if (session != null) {
            session.invalidate();  // Invalidate the session to log the user out
        }

        return ResponseEntity.ok("User logged out successfully");
    }

}
