package com.sloway.app.notification.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.notification.dto.response.NotificationResDto;
import com.sloway.app.notification.entity.NotificationEntity;
import lombok.RequiredArgsConstructor;
import static com.sloway.app.notification.entity.QNotificationEntity.notificationEntity;

import java.util.List;

@RequiredArgsConstructor
public class NotificationRepositoryImpl implements NotificationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<NotificationResDto> findByMemberNoAndReadAtIsNull(Long memberNo) {
        // 1. QueryDSL로 엔티티 리스트 조회
        List<NotificationEntity> entities = queryFactory
                .selectFrom(notificationEntity)
                .where(notificationEntity.memberNo.eq(memberNo)
                        .and(notificationEntity.read.isFalse()))
                .orderBy(notificationEntity.createdAt.desc())
                .fetch();

        // 2. 엔티티를 DTO로 변환
        return entities.stream()
                .map(NotificationResDto::fromEntityValues)
                .toList();
    }


}
