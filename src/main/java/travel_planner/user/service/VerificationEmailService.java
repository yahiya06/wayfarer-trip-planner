package travel_planner.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class VerificationEmailService {

    private static final Logger logger = LoggerFactory.getLogger(VerificationEmailService.class);

    private final JavaMailSender mailSender;
    private final String deliveryMode;
    private final String senderAddress;
    private final String frontendUrl;

    public VerificationEmailService(JavaMailSender mailSender,
                                    @Value("${app.email.delivery-mode:console}") String deliveryMode,
                                    @Value("${app.email.from:no-reply@wayfarer.local}") String senderAddress,
                                    @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.mailSender = mailSender;
        this.deliveryMode = deliveryMode;
        this.senderAddress = senderAddress;
        this.frontendUrl = frontendUrl;
    }

    public void sendVerificationLink(String email, String rawToken) {
        String verificationUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/verify-email")
                .queryParam("token", rawToken)
                .build()
                .encode()
                .toUriString();

        if ("console".equalsIgnoreCase(deliveryMode)) {
            logger.info("Local email verification link for {}: {}", email, verificationUrl);
            return;
        }
        if (!"smtp".equalsIgnoreCase(deliveryMode)) {
            throw new IllegalStateException("EMAIL_MODE must be either 'console' or 'smtp'.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderAddress);
        message.setTo(email);
        message.setSubject("Verify your Wayfarer account");
        message.setText("Welcome to Wayfarer. Verify your email within 24 hours using this link:\n\n"
                + verificationUrl + "\n\nIf you did not create this account, ignore this email.");
        mailSender.send(message);
    }
}
