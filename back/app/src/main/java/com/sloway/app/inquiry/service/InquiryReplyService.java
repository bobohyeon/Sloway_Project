package com.sloway.app.inquiry.service;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.admin.repository.AdminRepository;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.inquiry.dto.request.admin.InquiryReplyCreateReqDto;
import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.entity.InquiryReplyEntity;
import com.sloway.app.inquiry.exception.InquiryErrorCode;
import com.sloway.app.inquiry.repository.InquiryReplyRepository;
import com.sloway.app.notification.event.InquiryAnsweredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class InquiryReplyService {

    private final InquiryReplyRepository replyRepository;
    private final AdminRepository adminRepository;
    private final InquiryService inquiryService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void createReply(Long inquiryId, InquiryReplyCreateReqDto reqDto, Long adminNo) {
        InquiryEntity inquiry = inquiryService.getInquiry(inquiryId);
        if (inquiry.getReply() != null) {
            throw new CustomException(InquiryErrorCode.ALREADY_ANSWERED);
        }
        AdminEntity admin = adminRepository.findById(adminNo)
                .orElseThrow(() -> new CustomException(InquiryErrorCode.ADMIN_NOT_FOUND));

        replyRepository.save(reqDto.toEntity(inquiry, admin));
        inquiry.answer();
        log.info("[문의 답변 등록] inquiryId={}, adminNo={}", inquiryId, adminNo);
        eventPublisher.publishEvent(new InquiryAnsweredEvent(inquiry.getWriter().getNo(), inquiry.getTitle(),"가 등록되었습니다."));
    }

    @Transactional
    public void updateReply(Long inquiryId, InquiryReplyCreateReqDto reqDto) {
        InquiryEntity inquiry = inquiryService.getInquiry(inquiryId);
        InquiryReplyEntity reply = getReply(inquiry);
        reply.update(reqDto.getContent());
        log.info("[문의 답변 수정] inquiryId={}", inquiryId);
    }

    @Transactional
    public void deleteReply(Long inquiryId) {
        InquiryEntity inquiry = inquiryService.getInquiry(inquiryId);
        InquiryReplyEntity reply = getReply(inquiry);
        replyRepository.delete(reply);
        inquiry.cancelAnswer();
        log.info("[문의 답변 삭제] inquiryId={}", inquiryId);
    }

    private InquiryReplyEntity getReply(InquiryEntity inquiry) {
        if (inquiry.getReply() == null) {
            throw new CustomException(InquiryErrorCode.REPLY_NOT_FOUND);
        }
        return inquiry.getReply();
    }
}
