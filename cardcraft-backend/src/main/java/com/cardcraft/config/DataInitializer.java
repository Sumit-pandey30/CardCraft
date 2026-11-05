package com.cardcraft.config;

import com.cardcraft.entity.User;
import com.cardcraft.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${cardcraft.admin.email:admin@cardcraft.io}")
    private String adminEmail;

    @Value("${cardcraft.admin.password:Admin@CardCraft2025!}")
    private String adminPassword;

    @Value("${cardcraft.admin.name:CardCraft Administrator}")
    private String adminName;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase().trim())) {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail.toLowerCase().trim());
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole("ROLE_ADMIN");
            admin.setActive(true);
            admin.setBio("Platform System Administrator");

            userRepository.save(admin);
            logger.info("Default administrator account initialized: {}", adminEmail);
        }
    }
}
