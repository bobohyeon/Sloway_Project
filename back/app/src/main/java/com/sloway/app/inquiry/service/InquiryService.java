package com.sloway.app.inquiry.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.inquiry.dto.request.user.InquiryCreateReqDto;
import com.sloway.app.inquiry.dto.response.admin.AdminInquiryDetailResDto;
import com.sloway.app.inquiry.dto.response.admin.AdminInquiryListResDto;
import com.sloway.app.inquiry.dto.response.user.MyInquiryDetailResDto;
import com.sloway.app.inquiry.dto.response.user.MyInquiryListResDto;
import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import com.sloway.app.inquiry.exception.InquiryErrorCode;
import com.sloway.app.inquiry.repository.InquiryRepository;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final MemberRepository memberRepository;

    // 관리자
    public Page<AdminInquiryListResDto> findAllForAdmin(
            String status, String category, String keyword, Pageable pageable) {

        InquiryStatus statusEnum = StringUtils.hasText(status) && !"ALL".equalsIgnoreCase(status)
                ? InquiryStatus.from(status) : null;
        InquiryCategory categoryEnum = StringUtils.hasText(category)
                ? InquiryCategory.from(category) : null;

        return inquiryRepository
                .findAllByCondition(statusEnum, categoryEnum, keyword, pageable)
                .map(AdminInquiryListResDto::from);
    }

    public AdminInquiryDetailResDto findByIdForAdmin(Long id) {
        return AdminInquiryDetailResDto.from(getInquiry(id));
    }

    // 사용자
    public Page<MyInquiryListResDto> findMyInquiries(Long memberNo, Pageable pageable) {
        return inquiryRepository.findByWriterNo(memberNo, pageable)
                .map(MyInquiryListResDto::from);
    }

    public MyInquiryDetailResDto findMyInquiryById(Long id, Long memberNo) {
        InquiryEntity entity = getInquiry(id);
        validateWriter(entity, memberNo);
        return MyInquiryDetailResDto.from(entity);
    }

    @Transactional
    public void create(InquiryCreateReqDto reqDto, Long memberNo) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(InquiryErrorCode.MEMBER_NOT_FOUND));
        InquiryEntity entity = inquiryRepository.save(reqDto.toEntity(member));
        log.info("[문의 등록] id={}, memberNo={}", entity.getId(), memberNo);
    }

    @Transactional
    public void update(Long id, InquiryCreateReqDto reqDto, Long memberNo) {
        InquiryEntity entity = getInquiry(id);
        validateWriter(entity, memberNo);
        validatePending(entity);
        entity.update(reqDto.getTitle(), reqDto.getContent(), reqDto.getCategory());
        log.info("[문의 수정] id={}", id);
    }

    @Transactional
    public void delete(Long id, Long memberNo) {
        InquiryEntity entity = getInquiry(id);
        validateWriter(entity, memberNo);
        validatePending(entity);
        inquiryRepository.delete(entity);
        log.info("[문의 삭제] id={}", id);
    }

    // ── private ────────────────────────────────────────────────────────────────

    InquiryEntity getInquiry(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new CustomException(InquiryErrorCode.INQUIRY_NOT_FOUND));
    }

    private void validateWriter(InquiryEntity entity, Long memberNo) {
        if (!entity.getWriter().getNo().equals(memberNo)) {
            throw new CustomException(InquiryErrorCode.UNAUTHORIZED);
        }
    }

    private void validatePending(InquiryEntity entity) {
        if (entity.getStatus() != InquiryStatus.PENDING) {
            throw new CustomException(InquiryErrorCode.CANNOT_MODIFY_ANSWERED);
        }
    }
}
