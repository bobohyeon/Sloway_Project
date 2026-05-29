package com.sloway.app.inquiry.service;

import com.sloway.app.inquiry.dto.request.user.InquiryCreateReqDto;
import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public void createInquiry(InquiryCreateReqDto reqDto) {
        InquiryEntity inquiryEntity = inquiryRepository.save(reqDto.toEntity());
        log.info("[문의사항 등록] id={}, title={}", inquiryEntity.getId(), inquiryEntity.getTitle());
    }
}
