package com.sloway.app.notification.repository;

import com.sloway.app.notification.entity.NotificationEntity;
import com.sloway.app.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long>, NotificationRepositoryCustom {

    Page<NotificationEntity> findByMemberNoAndDelYnOrderByCreatedAtDesc(
            Long memberNo, String delYn, Pageable pageable);

    Page<NotificationEntity> findByMemberNoAndDelYnAndReadOrderByCreatedAtDesc(
            Long memberNo, String delYn, boolean read, Pageable pageable);

    Page<NotificationEntity> findByMemberNoAndDelYnAndTypeInOrderByCreatedAtDesc(
            Long memberNo, String delYn, List<NotificationType> types, Pageable pageable);

    long countByMemberNoAndDelYnAndRead(Long memberNo, String delYn, boolean read);

    List<NotificationEntity> findByMemberNoAndDelYnAndRead(
            Long memberNo, String delYn, boolean read);

    Optional<NotificationEntity> findByIdAndMemberNoAndDelYn(
            Long id, Long memberNo, String delYn);
}
