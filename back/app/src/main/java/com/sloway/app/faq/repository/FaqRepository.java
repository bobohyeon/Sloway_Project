package com.sloway.app.faq.repository;

import com.sloway.app.faq.entity.FaqEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FaqRepository extends JpaRepository<FaqEntity, Long>, FaqRepositoryCustom {
    Optional<FaqEntity> findByIdAndDelYn(Long id, String delYn);
}
