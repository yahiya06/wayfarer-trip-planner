package travel_planner.user.controller;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import travel_planner.user.dto.ChangePasswordRequest;
import travel_planner.user.dto.DeleteAccountRequest;
import travel_planner.user.dto.ProfileRequest;
import travel_planner.user.dto.UserResponse;
import travel_planner.user.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;

    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          SessionAuthenticationStrategy sessionAuthenticationStrategy) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
    }

    @GetMapping("/me")
    public UserResponse myProfile(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }

    @PatchMapping("/me")
    public UserResponse updateMyProfile(Authentication authentication,
                                         @Valid @RequestBody ProfileRequest request) {
        return userService.updateProfile(authentication.getName(), request);
    }

    @PutMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(Authentication authentication,
                               @Valid @RequestBody ChangePasswordRequest request,
                               HttpServletRequest servletRequest,
                               HttpServletResponse servletResponse) {
        userService.changePassword(authentication.getName(), request.currentPassword(), request.newPassword());
        Authentication refreshedAuthentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(authentication.getName(), request.newPassword()));
        establishSession(refreshedAuthentication, servletRequest, servletResponse);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(Authentication authentication,
                                               @Valid @RequestBody DeleteAccountRequest request,
                                               HttpServletRequest servletRequest) {
        userService.deleteAccount(authentication.getName(), request.currentPassword());
        SecurityContextHolder.clearContext();
        if (servletRequest.getSession(false) != null) {
            servletRequest.getSession(false).invalidate();
        }
        return ResponseEntity.noContent().build();
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
