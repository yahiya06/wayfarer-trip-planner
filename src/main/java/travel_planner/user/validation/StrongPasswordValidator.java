package travel_planner.user.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private static final Set<String> COMMON_PASSWORDS = Set.of(
            "password", "password1", "password123", "qwerty123", "12345678", "123456789", "11111111",
            "abcdefgh", "letmein123", "admin123"
    );

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) return true; // @NotBlank reports missing passwords separately.

        long length = password.codePoints().count();
        if (length < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72) return false;

        boolean uppercase = false;
        boolean lowercase = false;
        boolean digit = false;
        boolean symbol = false;
        int previous = -1;
        int repeated = 0;
        for (int character : password.codePoints().toArray()) {
            uppercase |= Character.isUpperCase(character);
            lowercase |= Character.isLowerCase(character);
            digit |= Character.isDigit(character);
            symbol |= !Character.isLetterOrDigit(character) && !Character.isWhitespace(character);
            repeated = character == previous ? repeated + 1 : 1;
            if (repeated >= 4) return false;
            previous = character;
        }

        String normalized = password.toLowerCase(Locale.ROOT);
        return uppercase && lowercase && digit && symbol && !COMMON_PASSWORDS.contains(normalized)
                && !normalized.contains("password") && !normalized.contains("qwerty")
                && !normalized.contains("123456");
    }
}
