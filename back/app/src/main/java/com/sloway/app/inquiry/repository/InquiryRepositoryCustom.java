package com.sloway.app.inquiry.repository;

import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InquiryRepositoryCustom {

    Page<InquiryEntity> findAllByCondition(InquiryStatus status, InquiryCategory category, String keyword, Pageable pageable);

    Page<InquiryEntity> findByWriterNo(Long memberNo, Pageable pageable);
}
