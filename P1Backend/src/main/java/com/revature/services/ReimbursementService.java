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
    private final SessionManager sessionManager;
    private final UserService userService;

    @Autowired
    public ReimbursementService(ReimbursementRepository reimbursementRepository, SessionManager sessionManager, UserService userService) {
        this.reimbursementRepository = reimbursementRepository;
        this.sessionManager = sessionManager;
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



    public List<ReimbursementDTO> getAllReimbursements(String sessionToken) {
        // Validate session and retrieve the current user
        User currentUser = sessionManager.validateSession(sessionToken);

        // Check if the current user is a manager
        if (!"MANAGER".equalsIgnoreCase(currentUser.getRole())) {
            throw new UnauthorizedException("Only managers are allowed to view all reimbursements.");
        }

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

    /**
     * Retrieves all reimbursements for the current user.
     *
     * @param sessionToken The session token to identify the current user.
     * @return A list of the current user's reimbursements.
     * @throws UnauthorizedException if the session is invalid.
     */
    public List<ReimbursementDTO> getReimbursementsForUser(String sessionToken) {
        // Validate session and retrieve the current user
        User currentUser = sessionManager.validateSession(sessionToken);

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
