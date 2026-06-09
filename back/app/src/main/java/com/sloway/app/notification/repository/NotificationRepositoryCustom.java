package com.sloway.app.notification.repository;

import com.sloway.app.notification.dto.response.NotificationResDto;

import java.util.List;

public interface NotificationRepositoryCustom {
    List<NotificationResDto> findByMemberNoAndReadAtIsNull(Long memberNo);
}
