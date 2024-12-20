package com.revature.controllers;

import com.revature.aspects.AdminOnly;
import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.ResourceNotFoundException;
import com.revature.exceptions.UnauthorizedException;
import com.revature.models.DTOs.ReimbursementDTO;
import com.revature.models.DTOs.ReimbursementDescriptionDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.services.ReimbursementService;
import com.revature.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@RestController
@RequestMapping("/reimbursements")
public class ReimbursementController {

    private final ReimbursementService reimbursementService;
    private final UserService userService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService, UserService userService) {
        this.reimbursementService = reimbursementService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<ReimbursementDTO> createReimbursement(@RequestBody ReimbursementDTO reimbursementDTO) {
        // Retrieve the current HTTP request and session
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false);

        // If session or userId is null, throw UnauthorizedException
        if (session == null || session.getAttribute("userId") == null) {
            throw new UnauthorizedException("User is not logged in");
        }

        // Fetch the current user from the session
        int userId = (int) session.getAttribute("userId");
        User currentUser = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Create the reimbursement using the service method
        Reimbursement createdReimbursement = reimbursementService.createReimbursement(reimbursementDTO, currentUser);

        // Map the created reimbursement to a DTO
        ReimbursementDTO createdReimbursementDTO = new ReimbursementDTO(
                createdReimbursement.getReimId(),
                createdReimbursement.getDescription(),
                createdReimbursement.getAmount(),
                createdReimbursement.getStatus(),
                createdReimbursement.getUser().getUserId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdReimbursementDTO);
    }


    @GetMapping("/my-reimbursements")
    public ResponseEntity<List<ReimbursementDTO>> getReimbursementsForUser() {
        // Retrieve the current HTTP request and session
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false);

        // If session or userId is null, throw UnauthorizedException
        if (session == null || session.getAttribute("userId") == null) {
            throw new UnauthorizedException("User is not logged in");
        }

        // Fetch the current user's userId from the session
        int userId = (int) session.getAttribute("userId");

        // Fetch the user from the service
        User currentUser = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Fetch the reimbursements for the current user
        List<ReimbursementDTO> reimbursements = reimbursementService.getReimbursementsForUser(currentUser);
        return ResponseEntity.ok(reimbursements);
    }


    @GetMapping
    @AdminOnly //only allow admins to access this method (enforecd by AuthAspect)
    public ResponseEntity<List<ReimbursementDTO>> getAllReimbursements() {
        // Fetch all reimbursements
        List<ReimbursementDTO> reimbursements = reimbursementService.getAllReimbursements();
        return ResponseEntity.ok(reimbursements);
    }

    @GetMapping("/pending")
    @AdminOnly
    public ResponseEntity<List<ReimbursementDTO>> getPendingReimbursements() {
        // Fetch all pending reimbursements
        List<ReimbursementDTO> reimbursements = reimbursementService.getPendingReimbursements();
        return ResponseEntity.ok(reimbursements);
    }

    @PutMapping("/resolve/{reimId}")
    @AdminOnly
    public ResponseEntity<ReimbursementDTO> resolveReimbursement(
            @PathVariable int reimId,
            @RequestBody ReimbursementDTO reimbursementDTO) {

        // Validate status
        if (!"APPROVED".equalsIgnoreCase(reimbursementDTO.getStatus()) && !"DENIED".equalsIgnoreCase(reimbursementDTO.getStatus())) {
            throw new BadRequestException("Invalid status. Only 'APPROVED' or 'DENIED' are allowed.");
        }

        // Call the service to resolve the reimbursement
        ReimbursementDTO updatedReimbursement = reimbursementService.resolveReimbursement(reimId, reimbursementDTO.getStatus());

        return ResponseEntity.ok(updatedReimbursement);
    }

    @PatchMapping("/update/{reimId}")
    public ResponseEntity<ReimbursementDTO> updateReimbursementDescription(
            @PathVariable int reimId,
            @RequestBody ReimbursementDescriptionDTO reimbursementDescriptionDTO) {

        // Retrieve the current user ID and role from the session
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession(false);
        Integer currentUserId = (session != null) ? (Integer) session.getAttribute("userId") : null;
        String currentUserRole = (session != null) ? (String) session.getAttribute("role") : null;

        if (currentUserId == null || currentUserRole == null) {
            throw new UnauthorizedException("User is not logged in");
        }

        // Call the service to update the description
        Reimbursement updatedReimbursement = reimbursementService.updateDescription(reimId, reimbursementDescriptionDTO.getDescription(), currentUserId, currentUserRole);

        // Manually convert the updated Reimbursement entity to a DTO
        ReimbursementDTO reimbursementDTO = new ReimbursementDTO(
                updatedReimbursement.getReimId(),
                updatedReimbursement.getDescription(),
                updatedReimbursement.getAmount(),
                updatedReimbursement.getStatus(),
                updatedReimbursement.getUser().getUserId()
        );

        return ResponseEntity.ok(reimbursementDTO);
    }

}
