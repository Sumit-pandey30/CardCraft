package com.cardcraft.repository;

import com.cardcraft.entity.CardTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardThemeRepository extends JpaRepository<CardTheme, Long> {
    Optional<CardTheme> findByName(String name);
    Optional<CardTheme> findByIsDefaultTrue();
}
