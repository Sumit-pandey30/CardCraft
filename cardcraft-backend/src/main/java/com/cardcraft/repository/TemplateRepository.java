package com.cardcraft.repository;

import com.cardcraft.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    Optional<Template> findByCode(String code);
    List<Template> findByActiveTrue();
}
