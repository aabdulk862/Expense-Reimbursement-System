package com.revature.services;

import com.revature.exceptions.UnauthorizedException;
import com.revature.models.User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionManager {

    // Thread-safe in-memory session store
    private final Map<String, User> sessionStore = new ConcurrentHashMap<>();

    /**
     * Creates a session for the authenticated user and generates a unique session token.
     *
     * @param user The authenticated user.
     * @return A unique session token.
     */
    public String createSession(User user) {
        // Generate a unique session token using UUID
        String token = UUID.randomUUID().toString();
        sessionStore.put(token, user);
        return token;
    }

    /**
     * Validates a session token and returns the associated user.
     *
     * @param token The session token to validate.
     * @return The authenticated user.
     * @throws UnauthorizedException if the session token is invalid.
     */
    public User validateSession(String token) {
        User user = sessionStore.get(token);
        if (user == null) {
            throw new UnauthorizedException("Invalid or expired session token.");
        }
        return user;
    }

    /**
     * Destroys a session token, effectively logging the user out.
     *
     * @param token The session token to destroy.
     */
    public void destroySession(String token) {
        sessionStore.remove(token);
    }
}



