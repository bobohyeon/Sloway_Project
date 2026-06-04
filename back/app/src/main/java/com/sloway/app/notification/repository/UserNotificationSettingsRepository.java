package com.sloway.app.notification.repository;

import com.sloway.app.notification.entity.UserNotificationSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNotificationSettingsRepository extends JpaRepository<UserNotificationSettingsEntity, Long> {
}
