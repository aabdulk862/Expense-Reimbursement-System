package com.revature.aspects;

import com.revature.exceptions.UnauthorizedException;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuthAspect {

    @Before("within(com.revature.controllers.*) " +
            "&& !execution(* com.revature.controllers.AuthController.login(..))" +
            "&& !execution(* com.revature.controllers.UserController.registerUser(..))")
    public void checkLoggedIn() {
        // Retrieve the current HTTP request
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false);

        // If the session is not available or the userId is not set in the session, throw UnauthorizedException
        if (session == null || session.getAttribute("userId") == null) {
            throw new UnauthorizedException("User is not logged in");
        }
    }
}
