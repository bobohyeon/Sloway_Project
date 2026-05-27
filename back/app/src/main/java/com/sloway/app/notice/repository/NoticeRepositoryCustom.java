package com.sloway.app.notice.repository;

import com.sloway.app.notice.enums.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.enums.NoticeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoticeRepositoryCustom {
    Page<NoticeEntity> findAllByCondition(NoticeCategory category, String keyword, NoticeStatus status, Pageable pageable);
}
