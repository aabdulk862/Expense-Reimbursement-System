package com.revature.services;

import com.revature.exceptions.BadRequestException;
import com.revature.exceptions.UnauthorizedException;
import com.revature.models.DTOs.ReimbursementDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.repository.ReimbursementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        if (reimbursementDTO.getDescription() == null || reimbursementDTO.getDescription().isEmpty()) {
            throw new BadRequestException("Description cannot be blank");
        }

        if (reimbursementDTO.getAmount() <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        if (reimbursementDTO.getStatus() == null || reimbursementDTO.getStatus().isEmpty()) {
            throw new BadRequestException("Status cannot be blank");
        }

        // Ensure the current user is trying to create a reimbursement for themselves
        if (reimbursementDTO.getUserId() != currentUser.getUserId()) {
            throw new UnauthorizedException("You can only create reimbursements for yourself.");
        }

        // Map DTO to Entity
        Reimbursement reimbursement = new Reimbursement();
        reimbursement.setDescription(reimbursementDTO.getDescription());
        reimbursement.setAmount(reimbursementDTO.getAmount());
        reimbursement.setStatus(reimbursementDTO.getStatus());

        // Fetch the user using the userId from the DTO
        User user = userService.findById(reimbursementDTO.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found with ID: " + reimbursementDTO.getUserId()));

        reimbursement.setUser(user);  // Associate the user with the reimbursement

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
}
