package com.sloway.app.notification.repository;

import com.sloway.app.notification.entity.HostNotificationSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostNotificationSettingsRepository extends JpaRepository<HostNotificationSettingsEntity, Long> {
}
