package com.sloway.app.notice.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.notice.entity.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.entity.NoticeStatus;
import com.sloway.app.notice.entity.QNoticeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class NoticeRepositoryImpl implements NoticeRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QNoticeEntity q = QNoticeEntity.noticeEntity;

    @Override
    public Page<NoticeEntity> findAllByCondition(
            NoticeCategory category, String keyword, NoticeStatus status, Pageable pageable) {

        List<NoticeEntity> content = queryFactory
                .selectFrom(q)
                .where(categoryEq(category), keywordContains(keyword), statusEq(status))
                .orderBy(q.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .where(categoryEq(category), keywordContains(keyword), statusEq(status))
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression categoryEq(NoticeCategory category) {
        return category != null ? q.category.eq(category) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword) ? q.title.containsIgnoreCase(keyword) : null;
    }

    private BooleanExpression statusEq(NoticeStatus status) {
        return status != null ? q.status.eq(status) : null;
    }
}