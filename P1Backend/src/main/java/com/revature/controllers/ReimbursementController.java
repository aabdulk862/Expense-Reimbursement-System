package com.revature.controllers;

import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.ResourceNotFoundException;
import com.revature.exceptions.UnauthorizedException;
import com.revature.models.DTOs.ReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.services.ReimbursementService;
import com.revature.services.SessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reimbursements")
public class ReimbursementController {

    private final ReimbursementService reimbursementService;
    private final SessionManager sessionManager;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService, SessionManager sessionManager) {
        this.reimbursementService = reimbursementService;
        this.sessionManager = sessionManager;
    }

    @PostMapping("/create")
    public ResponseEntity<Reimbursement> createReimbursement(
            @RequestHeader("Session-Token") String sessionToken,
            @RequestBody ReimbursementDTO reimbursementDTO) {

        // Validate the session
        User currentUser = sessionManager.validateSession(sessionToken);

        // Create the reimbursement from the DTO
        Reimbursement newReimbursement = reimbursementService.createReimbursement(reimbursementDTO, currentUser);

        // Return the created reimbursement with a 201 status
        return ResponseEntity.status(HttpStatus.CREATED).body(newReimbursement);
    }

    @GetMapping("/my-reimbursements")
    public ResponseEntity<List<ReimbursementDTO>> getReimbursementsForUser(
            @RequestHeader("Session-Token") String sessionToken) {
        List<ReimbursementDTO> reimbursements = reimbursementService.getReimbursementsForUser(sessionToken);
        return ResponseEntity.ok(reimbursements);
    }

    @GetMapping
    public ResponseEntity<List<ReimbursementDTO>> getAllReimbursements(
            @RequestHeader("Session-Token") String sessionToken) {
        List<ReimbursementDTO> reimbursements = reimbursementService.getAllReimbursements(sessionToken);
        return ResponseEntity.ok(reimbursements);
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