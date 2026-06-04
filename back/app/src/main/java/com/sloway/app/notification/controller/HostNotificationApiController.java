package com.sloway.app.notification.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.notification.dto.request.NotificationSettingsReqDto;
import com.sloway.app.notification.dto.response.HostNotificationSettingsResDto;
import com.sloway.app.notification.dto.response.NotificationPageResDto;
import com.sloway.app.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/host/notifications")
@RequiredArgsConstructor
public class HostNotificationApiController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<NotificationPageResDto> getList(
            @RequestParam(required = false, defaultValue = "ALL") String tab,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 8, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                notificationService.getHostNotifications(userDetails.getMemberNo(), tab, pageable));
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
    public ResponseEntity<HostNotificationSettingsResDto> getSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
                notificationService.getHostSettings(userDetails.getMemberNo()));
    }

    @PutMapping("/settings")
    public ResponseEntity<Void> updateSettings(
            @RequestBody NotificationSettingsReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.updateHostSettings(userDetails.getMemberNo(), reqDto);
        return ResponseEntity.ok().build();
    }
}
