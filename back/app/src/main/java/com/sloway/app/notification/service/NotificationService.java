package com.sloway.app.notification.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.notification.dto.request.NotificationSettingsReqDto;
import com.sloway.app.notification.dto.response.HostNotificationSettingsResDto;
import com.sloway.app.notification.dto.response.NotificationPageResDto;
import com.sloway.app.notification.dto.response.NotificationResDto;
import com.sloway.app.notification.dto.response.UserNotificationSettingsResDto;
import com.sloway.app.notification.entity.*;
import com.sloway.app.notification.error.NotificationErrorCode;
import com.sloway.app.notification.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationSettingsRepository userSettingsRepository;
    private final HostNotificationSettingsRepository hostSettingsRepository;

    // ── 알림 목록 (사용자) ────────────────────────────────────────────────────

    public NotificationPageResDto getUserNotifications(Long memberNo, String tab, Pageable pageable) {
        Page<NotificationEntity> page = fetchByTab(memberNo, tab, getUserTypes(tab), pageable);
        long unreadCount = notificationRepository.countByMemberNoAndDelYnAndRead(memberNo, "N", false);
        return NotificationPageResDto.of(page.map(NotificationResDto::from), unreadCount);
    }

    // ── 알림 목록 (호스트) ────────────────────────────────────────────────────

    public NotificationPageResDto getHostNotifications(Long memberNo, String tab, Pageable pageable) {
        Page<NotificationEntity> page = fetchByTab(memberNo, tab, getHostTypes(tab), pageable);
        long unreadCount = notificationRepository.countByMemberNoAndDelYnAndRead(memberNo, "N", false);
        return NotificationPageResDto.of(page.map(NotificationResDto::from), unreadCount);
    }

    // ── 읽음 처리 ─────────────────────────────────────────────────────────────

    @Transactional
    public void markAsRead(Long id, Long memberNo) {
        NotificationEntity notification = notificationRepository
                .findByIdAndMemberNoAndDelYn(id, memberNo, "N")
                .orElseThrow(() -> new CustomException(NotificationErrorCode.NOTIFICATION_NOT_FOUND));
        notification.markRead();
    }

    @Transactional
    public void markAllAsRead(Long memberNo) {
        List<NotificationEntity> unread = notificationRepository
                .findByMemberNoAndDelYnAndRead(memberNo, "N", false);
        unread.forEach(NotificationEntity::markRead);
    }

    // ── 알림 설정 (사용자) ────────────────────────────────────────────────────

    public UserNotificationSettingsResDto getUserSettings(Long memberNo) {
        UserNotificationSettingsEntity settings = userSettingsRepository.findById(memberNo)
                .orElseGet(() -> userSettingsRepository.save(
                        UserNotificationSettingsEntity.defaultFor(memberNo)));
        return UserNotificationSettingsResDto.from(settings);
    }

    @Transactional
    public void updateUserSettings(Long memberNo, NotificationSettingsReqDto reqDto) {
        UserNotificationSettingsEntity settings = userSettingsRepository.findById(memberNo)
                .orElseGet(() -> UserNotificationSettingsEntity.defaultFor(memberNo));
        settings.update(reqDto.toPushMap());
        userSettingsRepository.save(settings);
    }

    // ── 알림 설정 (호스트) ────────────────────────────────────────────────────

    public HostNotificationSettingsResDto getHostSettings(Long memberNo) {
        HostNotificationSettingsEntity settings = hostSettingsRepository.findById(memberNo)
                .orElseGet(() -> hostSettingsRepository.save(
                        HostNotificationSettingsEntity.defaultFor(memberNo)));
        return HostNotificationSettingsResDto.from(settings);
    }

    @Transactional
    public void updateHostSettings(Long memberNo, NotificationSettingsReqDto reqDto) {
        HostNotificationSettingsEntity settings = hostSettingsRepository.findById(memberNo)
                .orElseGet(() -> HostNotificationSettingsEntity.defaultFor(memberNo));
        settings.update(reqDto.toPushMap());
        hostSettingsRepository.save(settings);
    }

    // ── 내부 헬퍼 ─────────────────────────────────────────────────────────────

    private Page<NotificationEntity> fetchByTab(
            Long memberNo, String tab, List<NotificationType> types, Pageable pageable) {

        if ("UNREAD".equals(tab)) {
            return notificationRepository.findByMemberNoAndDelYnAndReadOrderByCreatedAtDesc(
                    memberNo, "N", false, pageable);
        }
        if (types != null && !types.isEmpty()) {
            return notificationRepository.findByMemberNoAndDelYnAndTypeInOrderByCreatedAtDesc(
                    memberNo, "N", types, pageable);
        }
        return notificationRepository.findByMemberNoAndDelYnOrderByCreatedAtDesc(
                memberNo, "N", pageable);
    }

    private List<NotificationType> getUserTypes(String tab) {
        if (tab == null) return null;
        return switch (tab) {
            case "BOOKING_PAYMENT" -> List.of(
                    NotificationType.PAYMENT, NotificationType.POINT, NotificationType.COUPON);
            case "EVENT" -> List.of(NotificationType.EVENT);
            default -> null;
        };
    }

    private List<NotificationType> getHostTypes(String tab) {
        if (tab == null) return null;
        return switch (tab) {
            case "RESERVATION" -> List.of(
                    NotificationType.RESERVATION, NotificationType.CHAT,
                    NotificationType.REVIEW, NotificationType.CHECKIN);
            case "SETTLEMENT" -> List.of(
                    NotificationType.SETTLEMENT, NotificationType.PAYMENT, NotificationType.POLICY);
            default -> null;
        };
    }
}
