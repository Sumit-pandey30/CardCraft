package com.cardcraft.repository;

import com.cardcraft.entity.CardShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardShareRepository extends JpaRepository<CardShare, Long> {

    long countByCardId(Long cardId);

    @Query("SELECT cs.shareMedium, COUNT(cs) FROM CardShare cs WHERE cs.card.id = :cardId GROUP BY cs.shareMedium")
    List<Object[]> countSharesByMedium(@Param("cardId") Long cardId);

    @Query("SELECT COUNT(cs) FROM CardShare cs WHERE cs.card.user.id = :userId")
    long countSharesByUserId(@Param("userId") Long userId);
}
