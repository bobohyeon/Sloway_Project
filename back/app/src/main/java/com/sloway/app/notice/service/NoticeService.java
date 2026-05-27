package com.sloway.app.notice.service;

import com.sloway.app.notice.dto.request.NoticeWriteReqDto;
import com.sloway.app.notice.dto.response.NoticeDetailResDto;
import com.sloway.app.notice.dto.response.NoticeListResDto;
import com.sloway.app.notice.enums.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.enums.NoticeStatus;
import com.sloway.app.notice.repository.NoticeRepository;
import org.springframework.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;


    public Page<NoticeListResDto> findAll(
            String category, String keyword, String status, Pageable pageable) {

        NoticeCategory categoryEnum = StringUtils.hasText(category)
                ? NoticeCategory.from(category) : null;
        NoticeStatus statusEnum = StringUtils.hasText(status) && !"all".equalsIgnoreCase(status)
                ? NoticeStatus.from(status) : null;

        return noticeRepository
                .findAllByCondition(categoryEnum, keyword, statusEnum, pageable)
                .map(NoticeListResDto::from);
    }

    @Transactional
    public NoticeDetailResDto findById(Long id) {
        NoticeEntity noticeEntity = noticeRepository.findByIdAndDelYn(id , "N")
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다. id=" + id));

        noticeEntity.increaseViewCount();

        log.info("[공지사항 상세 조회] id={}, viewCount={}", id, noticeEntity.getViewCount());
        return NoticeDetailResDto.from(noticeEntity);
    }


    @Transactional
    public void write(NoticeWriteReqDto reqDto) {
        NoticeEntity noticeEntity = noticeRepository.save(reqDto.toEntity());
        log.info("[공지사항 등록] id={}, title={}", noticeEntity.getId(), noticeEntity.getTitle());
    }

    @Transactional
    public void update(Long id, NoticeWriteReqDto reqDto) {
        NoticeEntity noticeEntity = noticeRepository.findByIdAndDelYn(id , "N")
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다. id=" + id));

        noticeEntity.update(reqDto.getTitle(), reqDto.getContent(),
                reqDto.getCategory(), reqDto.getStatus());
        log.info("[공지사항 수정] id={}", id);
    }

    @Transactional
    public void delete(Long id) {
        NoticeEntity noticeEntity = noticeRepository.findByIdAndDelYn(id , "N")
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항입니다. id=" + id));
        noticeEntity.delete();
        log.info("[공지사항 삭제] id={}", id);
    }

    @Transactional
    public void deleteAll(List<Long> ids) {
        List<NoticeEntity> notices = noticeRepository.findAllByIdInAndDelYn(ids ,"N");
        if (notices.size() != ids.size()) {
            throw new IllegalArgumentException("존재하지 않는 공지사항이 포함되어 있습니다.");
        }
        notices.forEach(NoticeEntity::delete);
        log.info("[공지사항 일괄 삭제] ids={}", ids);
    }
}