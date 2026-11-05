package com.cardcraft.repository;

import com.cardcraft.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findByCardIdOrderByDisplayOrderAsc(Long cardId);
    void deleteByCardId(Long cardId);
}
