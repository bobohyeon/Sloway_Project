package com.sloway.app.inquiry.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.inquiry.entity.InquiryEntity;
import com.sloway.app.inquiry.entity.QInquiryEntity;
import com.sloway.app.inquiry.enums.InquiryCategory;
import com.sloway.app.inquiry.enums.InquiryStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class InquiryRepositoryImpl implements InquiryRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QInquiryEntity q = QInquiryEntity.inquiryEntity;

    @Override
    public Page<InquiryEntity> findAllByCondition(
            InquiryStatus status, InquiryCategory category, String keyword, Pageable pageable) {

        List<InquiryEntity> content = queryFactory
                .selectFrom(q)
                .where(statusEq(status), categoryEq(category), keywordContains(keyword))
                .orderBy(q.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .where(statusEq(status), categoryEq(category), keywordContains(keyword))
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    @Override
    public Page<InquiryEntity> findByWriterNo(Long memberNo, Pageable pageable) {
        List<InquiryEntity> content = queryFactory
                .selectFrom(q)
                .where(q.writer.no.eq(memberNo))
                .orderBy(q.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .where(q.writer.no.eq(memberNo))
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression statusEq(InquiryStatus status) {
        return status != null ? q.status.eq(status) : null;
    }

    private BooleanExpression categoryEq(InquiryCategory category) {
        return category != null ? q.category.eq(category) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword) ? q.title.containsIgnoreCase(keyword) : null;
    }
}
