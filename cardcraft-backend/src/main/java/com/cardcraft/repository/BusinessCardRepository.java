package com.cardcraft.repository;

import com.cardcraft.entity.BusinessCard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessCardRepository extends JpaRepository<BusinessCard, Long> {

    Page<BusinessCard> findByUserIdAndActiveTrue(Long userId, Pageable pageable);

    List<BusinessCard> findByUserIdAndActiveTrueOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"socialLinks", "template", "theme"})
    Optional<BusinessCard> findByIdAndUserIdAndActiveTrue(Long id, Long userId);

    @EntityGraph(attributePaths = {"socialLinks", "template", "theme"})
    Optional<BusinessCard> findBySlugAndPublishedTrueAndActiveTrue(String slug);

    @EntityGraph(attributePaths = {"socialLinks", "template", "theme"})
    Optional<BusinessCard> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    long countByUserIdAndActiveTrue(Long userId);

    @Query("SELECT COALESCE(SUM(c.viewCount), 0) FROM BusinessCard c WHERE c.user.id = :userId AND c.active = true")
    long sumViewsByUserId(@Param("userId") Long userId);
}
