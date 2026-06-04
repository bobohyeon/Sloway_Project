package com.sloway.app.faq.repository;

import com.sloway.app.faq.entity.FaqEntity;
import com.sloway.app.faq.enums.FaqCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FaqRepositoryCustom {
    Page<FaqEntity> findAllByCondition(FaqCategory category, String keyword, Pageable pageable);
}
