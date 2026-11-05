package com.cardcraft.repository;

import com.cardcraft.entity.CardView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CardViewRepository extends JpaRepository<CardView, Long> {

    long countByCardId(Long cardId);

    Page<CardView> findByCardIdOrderByViewedAtDesc(Long cardId, Pageable pageable);

    @Query("SELECT cv.deviceType, COUNT(cv) FROM CardView cv WHERE cv.card.id = :cardId GROUP BY cv.deviceType")
    List<Object[]> countViewsByDeviceType(@Param("cardId") Long cardId);

    @Query("SELECT cv.referer, COUNT(cv) FROM CardView cv WHERE cv.card.id = :cardId AND cv.referer IS NOT NULL GROUP BY cv.referer ORDER BY COUNT(cv) DESC")
    List<Object[]> countViewsByReferer(@Param("cardId") Long cardId, Pageable pageable);

    @Query("SELECT cv FROM CardView cv WHERE cv.card.id = :cardId AND cv.viewedAt >= :since ORDER BY cv.viewedAt ASC")
    List<CardView> findViewsSince(@Param("cardId") Long cardId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(cv) FROM CardView cv WHERE cv.card.user.id = :userId AND cv.viewedAt >= :since")
    long countViewsForUserSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
