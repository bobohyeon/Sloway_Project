package com.sloway.app.faq.service;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.admin.repository.AdminRepository;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.faq.dto.request.FaqWriteReqDto;
import com.sloway.app.faq.dto.response.user.FaqListResDto;
import com.sloway.app.faq.entity.FaqEntity;
import com.sloway.app.faq.enums.FaqCategory;
import com.sloway.app.faq.exception.FaqErrorCode;
import com.sloway.app.faq.repository.FaqRepository;
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
public class FaqService {

    private final FaqRepository faqRepository;
    private final AdminRepository adminRepository;

    public Page<FaqListResDto> findAll(String category, String keyword, Pageable pageable) {
        FaqCategory categoryEnum = StringUtils.hasText(category) ? FaqCategory.from(category) : null;
        return faqRepository.findAllByCondition(categoryEnum, keyword, pageable)
                .map(FaqListResDto::from);
    }

    public FaqListResDto findById(Long id) {
        return FaqListResDto.from(getFaq(id));
    }

    @Transactional
    public void create(FaqWriteReqDto reqDto, Long adminNo) {
        AdminEntity admin = adminRepository.findById(adminNo)
                .orElseThrow(() -> new CustomException(FaqErrorCode.ADMIN_NOT_FOUND));
        FaqEntity faq = faqRepository.save(reqDto.toEntity(admin));
        log.info("[FAQ 등록] id={}, title={}", faq.getId(), faq.getTitle());
    }

    @Transactional
    public void update(Long id, FaqWriteReqDto reqDto) {
        FaqEntity faq = getFaq(id);
        faq.update(reqDto.getTitle(), reqDto.getContent(), reqDto.getCategory());
        log.info("[FAQ 수정] id={}", id);
    }

    @Transactional
    public void delete(Long id) {
        getFaq(id).delete();
        log.info("[FAQ 삭제] id={}", id);
    }

    private FaqEntity getFaq(Long id) {
        return faqRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new CustomException(FaqErrorCode.FAQ_NOT_FOUND));
    }
}
