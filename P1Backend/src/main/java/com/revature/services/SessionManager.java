package com.revature.utils;

import com.revature.models.User;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class SessionManager {
    private static final Map<String, User> sessions = new HashMap<>();

    // Generate and store session
    public static String createSession(User user) {
        String token = UUID.randomUUID().toString(); // Generate a unique token
        sessions.put(token, user);
        return token;
    }

    // Validate session and get the user
    public static User getUserFromToken(String token) {
        return sessions.get(token);
    }

    // End session
    public static void invalidateSession(String token) {
        sessions.remove(token);
    }
}



