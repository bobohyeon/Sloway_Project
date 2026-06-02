package com.sloway.app.faq.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.faq.entity.FaqEntity;
import com.sloway.app.faq.entity.QFaqEntity;
import com.sloway.app.faq.enums.FaqCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class FaqRepositoryImpl implements FaqRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QFaqEntity q = QFaqEntity.faqEntity;

    @Override
    public Page<FaqEntity> findAllByCondition(FaqCategory category, String keyword, Pageable pageable) {
        BooleanExpression condition = q.delYn.eq("N")
                .and(categoryEq(category))
                .and(keywordContains(keyword));

        List<FaqEntity> content = queryFactory.selectFrom(q)
                .where(condition)
                .orderBy(q.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = queryFactory.select(q.count()).from(q).where(condition).fetchOne();
        return new PageImpl<>(content, pageable, count == null ? 0 : count);
    }

    private BooleanExpression categoryEq(FaqCategory category) {
        return category != null ? q.category.eq(category) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword)
                ? q.title.containsIgnoreCase(keyword).or(q.content.containsIgnoreCase(keyword))
                : null;
    }
}
