package com.sloway.app.inquiry.repository;

import com.sloway.app.inquiry.entity.InquiryReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryReplyRepository extends JpaRepository<InquiryReplyEntity, Long>, InquiryRepositoryCustom{
}
