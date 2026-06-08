package com.sloway.app.notice.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.notice.enums.NoticeCategory;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.entity.QNoticeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class NoticeRepositoryImpl implements NoticeRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final QNoticeEntity q = QNoticeEntity.noticeEntity;

    @Override
    public Page<NoticeEntity> findAllByCondition(
            NoticeCategory category, String keyword, Pageable pageable) {

        OrderSpecifier<?>[] orders = buildOrderSpecifiers(pageable.getSort());

        List<NoticeEntity> content = queryFactory
                .selectFrom(q)
                .where(categoryEq(category), keywordContains(keyword))
                .orderBy(orders)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .where(categoryEq(category), keywordContains(keyword))
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private OrderSpecifier<?>[] buildOrderSpecifiers(Sort sort) {
        if (sort.isUnsorted()) {
            return new OrderSpecifier[]{q.createdAt.desc()};
        }
        return sort.stream()
                .map(o -> {
                    Order dir = o.isAscending() ? Order.ASC : Order.DESC;
                    return switch (o.getProperty()) {
                        case "viewCount" -> new OrderSpecifier<>(dir, q.viewCount);
                        case "title"     -> new OrderSpecifier<>(dir, q.title);
                        default          -> new OrderSpecifier<>(dir, q.createdAt);
                    };
                })
                .toArray(OrderSpecifier[]::new);
    }

    private BooleanExpression categoryEq(NoticeCategory category) {
        return category != null ? q.category.eq(category) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword) ? q.title.containsIgnoreCase(keyword) : null;
    }
}