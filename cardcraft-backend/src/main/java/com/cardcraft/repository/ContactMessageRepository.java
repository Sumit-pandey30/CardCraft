package com.cardcraft.repository;

import com.cardcraft.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findByCardIdOrderBySentAtDesc(Long cardId, Pageable pageable);
    List<ContactMessage> findByCardUserIdOrderBySentAtDesc(Long userId);
    long countByCardUserIdAndIsReadFalse(Long userId);
}
