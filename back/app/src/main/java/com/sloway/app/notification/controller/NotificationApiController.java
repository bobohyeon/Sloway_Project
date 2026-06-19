package com.sloway.app.notification.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.notification.dto.request.NotificationSettingsReqDto;
import com.sloway.app.notification.dto.response.NotificationPageResDto;
import com.sloway.app.notification.dto.response.NotificationResDto;
import com.sloway.app.notification.dto.response.UserNotificationSettingsResDto;
import com.sloway.app.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.util.List;

@RestController
@RequestMapping("api/notifications")
@RequiredArgsConstructor
public class NotificationApiController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<NotificationPageResDto> getList(
            @RequestParam(required = false, defaultValue = "ALL") String tab,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 8, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                notificationService.getUserNotifications(userDetails.getMemberNo(), tab, pageable));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAsRead(id, userDetails.getMemberNo());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getMemberNo());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/settings")
    public ResponseEntity<UserNotificationSettingsResDto> getSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
                notificationService.getUserSettings(userDetails.getMemberNo()));
    }

    @PutMapping("/settings")
    public ResponseEntity<Void> updateSettings(
            @RequestBody NotificationSettingsReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.updateUserSettings(userDetails.getMemberNo(), reqDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("new/list")
    public ResponseEntity<List<NotificationResDto>> getNewList(
            @AuthenticationPrincipal CustomUserDetails userDetails) throws AuthenticationException {
        Long memberNo = userDetails.getMemberNo();
        if (memberNo == null){
            throw new AuthenticationException("[로그인 먼저]");
        }
        List<NotificationResDto> dto = notificationService.getNewList(memberNo);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) throws AuthenticationException {
        Long memberNo = userDetails.getMemberNo();
        if (memberNo == null){
            throw new AuthenticationException("[로그인 먼저]");
        }

        notificationService.deleteNotification  (id, memberNo);

        return ResponseEntity.ok().build();
    }
}
