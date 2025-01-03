package com.revature.services;

import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.UnauthorizedException;
import com.revature.models.DTOs.ReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.repository.ReimbursementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReimbursementService {

    private final ReimbursementRepository reimbursementRepository;
    private final UserService userService;

    @Autowired
    public ReimbursementService(ReimbursementRepository reimbursementRepository, UserService userService) {
        this.reimbursementRepository = reimbursementRepository;
        this.userService = userService;
    }

    public Reimbursement createReimbursement(ReimbursementDTO reimbursementDTO, User currentUser) {
        // Validate fields
        if (reimbursementDTO.getDescription() == null || reimbursementDTO.getDescription().isEmpty()) {
            throw new BadRequestException("Description cannot be blank.");
        }

        if (reimbursementDTO.getAmount() <= 0) {
            throw new BadRequestException("Amount must be greater than zero.");
        }

        // Ensure the current user is trying to create a reimbursement for themselves
        if (reimbursementDTO.getUserId() != 0 && reimbursementDTO.getUserId() != currentUser.getUserId()) {
            throw new UnauthorizedException("You can only create reimbursements for yourself.");
        }

        // Map DTO to Entity
        Reimbursement reimbursement = new Reimbursement();
        reimbursement.setDescription(reimbursementDTO.getDescription());
        reimbursement.setAmount(reimbursementDTO.getAmount());
        reimbursement.setStatus(reimbursementDTO.getStatus()); // Status is now a String

        // Use the currentUser directly to associate the user
        reimbursement.setUser(currentUser);

        // Save the reimbursement
        return reimbursementRepository.save(reimbursement);
    }

    public List<ReimbursementDTO> getAllReimbursements() {
        // Fetch all reimbursements from the repository
        List<Reimbursement> reimbursements = reimbursementRepository.findAll();

        // Convert Reimbursement entities to ReimbursementDTOs
        return reimbursements.stream()
                .map(reimbursement -> new ReimbursementDTO(
                        reimbursement.getReimId(),
                        reimbursement.getDescription(),
                        reimbursement.getAmount(),
                        reimbursement.getStatus(),
                        reimbursement.getUser().getUserId()))
                .collect(Collectors.toList());
    }

    public List<ReimbursementDTO> getReimbursementsForUser(User currentUser) {
        // Fetch all reimbursements for the current user
        List<Reimbursement> reimbursements = reimbursementRepository.findByUser(currentUser);

        // Convert Reimbursement entities to ReimbursementDTOs
        return reimbursements.stream()
                .map(reimbursement -> new ReimbursementDTO(
                        reimbursement.getReimId(),
                        reimbursement.getDescription(),
                        reimbursement.getAmount(),
                        reimbursement.getStatus(),
                        reimbursement.getUser().getUserId()))
                .collect(Collectors.toList());
    }

    public List<ReimbursementDTO> getPendingReimbursements() {
        // Fetch all pending reimbursements where status is "PENDING"
        List<Reimbursement> pendingReimbursements = reimbursementRepository.findByStatus("PENDING");

        // Create an empty list to store the DTOs
        List<ReimbursementDTO> pendingReimbursementDTOs = new ArrayList<>();

        // Map each Reimbursement to a ReimbursementDTO
        for (Reimbursement reimbursement : pendingReimbursements) {
            ReimbursementDTO dto = new ReimbursementDTO(
                    reimbursement.getReimId(),
                    reimbursement.getDescription(),
                    reimbursement.getAmount(),
                    reimbursement.getStatus(),
                    reimbursement.getUser().getUserId()
            );
            pendingReimbursementDTOs.add(dto);
        }

        // Return the list of DTOs
        return pendingReimbursementDTOs;
    }

    public List<ReimbursementDTO> getPendingReimbursementsForUser(User currentUser) {
        // Fetch reimbursements for the current user with status 'PENDING'
        List<Reimbursement> pendingReimbursements = reimbursementRepository.findByUserAndStatus(currentUser, "PENDING");

        // Convert Reimbursement entities to ReimbursementDTOs
        return pendingReimbursements.stream()
                .map(reimbursement -> new ReimbursementDTO(
                        reimbursement.getReimId(),
                        reimbursement.getDescription(),
                        reimbursement.getAmount(),
                        reimbursement.getStatus(),
                        reimbursement.getUser().getUserId()))
                .collect(Collectors.toList());
    }

    public ReimbursementDTO resolveReimbursement(int reimId, String status) {
        // Fetch the reimbursement by ID
        Reimbursement reimbursement = reimbursementRepository.findById(reimId)
                .orElseThrow(() -> new BadRequestException("Reimbursement not found with ID: " + reimId));

        // Check if the current status is 'PENDING'
        if (!"PENDING".equalsIgnoreCase(reimbursement.getStatus())) {
            throw new BadRequestException("Reimbursement is not in PENDING status.");
        }

        // Update the status of the reimbursement
        reimbursement.setStatus(status.toUpperCase());  // Update the status to APPROVED or DENIED

        // Save the updated reimbursement
        reimbursement = reimbursementRepository.save(reimbursement);

        // Convert the updated reimbursement to DTO and return it
        return new ReimbursementDTO(
                reimbursement.getReimId(),
                reimbursement.getDescription(),
                reimbursement.getAmount(),
                reimbursement.getStatus(),
                reimbursement.getUser().getUserId()
        );
    }

    public Reimbursement updateDescription(int reimId, String newDescription, int userId, String userRole) {
        // Fetch the reimbursement
        Reimbursement reimbursement = reimbursementRepository.findById(reimId)
                .orElseThrow(() -> new BadRequestException("Reimbursement not found"));

        // If the user is a manager, allow them to update any reimbursement
        if ("manager".equalsIgnoreCase(userRole)) {
            reimbursement.setDescription(newDescription);
        } else {
            // Otherwise, check if the reimbursement is pending and if the user owns it
            if (!"PENDING".equalsIgnoreCase(reimbursement.getStatus())) {
                throw new BadRequestException("You can only update the description of pending reimbursements.");
            }

            // Ensure the user is the owner of the reimbursement
            if (reimbursement.getUser().getUserId() != userId) {
                throw new UnauthorizedException("You can only update your own reimbursements.");
            }

            // Update the description for the employee
            reimbursement.setDescription(newDescription);
        }

        // Save the updated reimbursement
        return reimbursementRepository.save(reimbursement);
    }



}
