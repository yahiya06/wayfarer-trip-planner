package travel_planner.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import travel_planner.user.dto.LoginRequest;
import travel_planner.user.dto.MessageResponse;
import travel_planner.user.dto.ResendVerificationRequest;
import travel_planner.user.dto.RegisterRequest;
import travel_planner.user.dto.UserResponse;
import travel_planner.user.dto.VerificationNotice;
import travel_planner.user.dto.VerifyEmailRequest;
import travel_planner.user.model.AppUser;
import travel_planner.user.service.EmailVerificationService;
import travel_planner.user.service.VerificationEmailService;
import travel_planner.user.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final VerificationEmailService verificationEmailService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;

    public AuthController(UserService userService,
                          EmailVerificationService emailVerificationService,
                          VerificationEmailService verificationEmailService,
                          AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          SessionAuthenticationStrategy sessionAuthenticationStrategy) {
        this.userService = userService;
        this.emailVerificationService = emailVerificationService;
        this.verificationEmailService = verificationEmailService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        return Map.of("token", csrfToken.getToken());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public VerificationNotice register(@Valid @RequestBody RegisterRequest request) {
        AppUser user = userService.register(request);
        String token = emailVerificationService.issue(user);
        verificationEmailService.sendVerificationLink(user.getEmail(), token);
        return new VerificationNotice("Check your email for a verification link.", user.getEmail());
    }

    @PostMapping("/verify-email")
    public MessageResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        emailVerificationService.verify(request.token());
        return new MessageResponse("Email verified. You can now log in.");
    }

    @PostMapping("/resend-verification")
    public MessageResponse resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        userService.findForVerification(request.email())
                .filter(user -> !user.isEmailVerified())
                .ifPresent(user -> {
                    String token = emailVerificationService.issue(user);
                    verificationEmailService.sendVerificationLink(user.getEmail(), token);
                });
        return new MessageResponse("If that address has an unverified account, a new verification link has been sent.");
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request,
                              HttpServletRequest servletRequest,
                              HttpServletResponse servletResponse) {
        Authentication authentication = authenticate(request.email(), request.password());
        establishSession(authentication, servletRequest, servletResponse);
        return userService.getProfile(authentication.getName());
    }

    @GetMapping("/me")
    public UserResponse currentUser(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }

    private Authentication authenticate(String email, String password) {
        return authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(email, password));
    }

    private void establishSession(Authentication authentication,
                                  HttpServletRequest request,
                                  HttpServletResponse response) {
        sessionAuthenticationStrategy.onAuthentication(authentication, request, response);
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }
}
