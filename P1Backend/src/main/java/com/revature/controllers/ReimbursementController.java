package com.revature.controllers;

import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.ResourceNotFoundException;
import com.revature.models.DTOs.ReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.services.ReimbursementService;
import com.revature.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Reimbursement> createReimbursement(
            @RequestBody ReimbursementDTO reimbursementDTO) {

        // Fetch the user based on the userId provided in the DTO
        User user = userService.findById(reimbursementDTO.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found with ID: " + reimbursementDTO.getUserId()));

        // Create the reimbursement from the DTO and the current user
        Reimbursement newReimbursement = reimbursementService.createReimbursement(reimbursementDTO, user);

        // Return the created reimbursement with a 201 status
        return ResponseEntity.status(HttpStatus.CREATED).body(newReimbursement);
    }

    @GetMapping("/my-reimbursements")
    public ResponseEntity<List<ReimbursementDTO>> getReimbursementsForUser(
            @RequestParam("userId") int userId) {
        // Fetch the user based on the userId provided in the request
        User currentUser = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Fetch the reimbursements for the specified user
        List<ReimbursementDTO> reimbursements = reimbursementService.getReimbursementsForUser(currentUser);
        return ResponseEntity.ok(reimbursements);
    }

    @GetMapping
    public ResponseEntity<List<ReimbursementDTO>> getAllReimbursements() {
        // Fetch all reimbursements
        List<ReimbursementDTO> reimbursements = reimbursementService.getAllReimbursements();
        return ResponseEntity.ok(reimbursements);
    }

}
