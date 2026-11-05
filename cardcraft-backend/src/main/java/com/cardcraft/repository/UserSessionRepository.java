package com.cardcraft.repository;

import com.cardcraft.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findByRefreshTokenHashAndRevokedFalse(String refreshTokenHash);
    List<UserSession> findByUserIdAndRevokedFalse(Long userId);
    void deleteByUserId(Long userId);
}
