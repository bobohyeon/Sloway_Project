package com.sloway.app.notification.repository;

import com.sloway.app.notification.dto.response.NotificationResDto;
import com.sloway.app.notification.entity.NotificationEntity;

import java.util.List;

public interface NotificationRepositoryCustom {
    List<NotificationResDto> findByMemberNoAndReadAtIsNull(Long memberNo);

    NotificationEntity findByTargetNoAndReadIsNull(Long id, Long memberNo, String type);
}
