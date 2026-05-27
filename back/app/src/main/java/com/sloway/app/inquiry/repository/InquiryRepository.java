package com.sloway.app.inquiry.repository;

import com.sloway.app.inquiry.entity.InquiryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository extends JpaRepository<InquiryEntity, Long>, InquiryRepositoryCustom {
}
