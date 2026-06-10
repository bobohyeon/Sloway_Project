package com.sloway.app.notification.event;

import com.sloway.app.notification.dto.response.NotificationResDto;
import com.sloway.app.notification.entity.NotificationEntity;
import com.sloway.app.notification.entity.NotificationType;
import com.sloway.app.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 비동기 처리와 트랜잭션 분리
    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleNotification(NotificationEvent event) {
        NotificationEntity entity = NotificationEntity.builder()
                .memberNo(event.getTargetMemberNo())
                .type(NotificationType.valueOf(event.getTypeCode()))
                .title(event.getTitle())
                .description(event.getDescription())
                .read(false)
                .build();

        NotificationEntity savedEntity = notificationRepository.save(entity);

        String destination = "/sub/notifications/" + event.getTargetMemberNo();
        messagingTemplate.convertAndSend(destination, NotificationResDto.fromEntityValues(savedEntity));
    }
}
