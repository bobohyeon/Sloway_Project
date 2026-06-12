package com.sloway.app.chat.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.chat.dto.request.ChatRoomByPlaceReqDto;
import com.sloway.app.chat.dto.request.ChatRoomCreateReqDto;
import com.sloway.app.chat.dto.response.ChatMessageResDto;
import com.sloway.app.chat.dto.response.ChatRoomResDto;
import com.sloway.app.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatApiController {

    private final ChatService chatService;

    // ─── USER 채팅 ────────────────────────────────────────────────────────────

    @PostMapping("/api/user/chat/rooms")
    public ResponseEntity<ChatRoomResDto> userCreateRoom(
            @RequestBody ChatRoomCreateReqDto req,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getOrCreateRoom(req.getRsvnNo(), user.getMemberNo()));
    }

    @PostMapping("/api/user/chat/rooms/by-place")
    public ResponseEntity<ChatRoomResDto> userCreateRoomByPlace(
            @RequestBody ChatRoomByPlaceReqDto req,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(
                chatService.getOrCreateRoomByPlace(req.getEntityNo(), req.getPlaceType(), user.getMemberNo()));
    }

    @GetMapping("/api/user/chat/unread-count")
    public ResponseEntity<Long> userUnreadCount(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getTotalUnreadForUser(user.getMemberNo()));
    }

    @GetMapping("/api/user/chat/rooms")
    public ResponseEntity<List<ChatRoomResDto>> userRooms(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getRoomsForUser(user.getMemberNo()));
    }

    @GetMapping("/api/user/chat/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageResDto>> userMessages(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getMessages(roomId, user.getMemberNo()));
    }

    @PatchMapping("/api/user/chat/rooms/{roomId}/read")
    public ResponseEntity<Void> userMarkRead(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails user) {
        chatService.markAsRead(roomId, user.getMemberNo());
        return ResponseEntity.ok().build();
    }

    // ─── HOST 채팅 ────────────────────────────────────────────────────────────

    @PostMapping("/api/host/chat/rooms")
    public ResponseEntity<ChatRoomResDto> hostCreateRoom(
            @RequestBody ChatRoomCreateReqDto req,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getOrCreateRoom(req.getRsvnNo(), user.getMemberNo()));
    }

    @GetMapping("/api/host/chat/unread-count")
    public ResponseEntity<Long> hostUnreadCount(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getTotalUnreadForHost(user.getMemberNo()));
    }

    @GetMapping("/api/host/chat/rooms")
    public ResponseEntity<List<ChatRoomResDto>> hostRooms(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getRoomsForHost(user.getMemberNo()));
    }

    @GetMapping("/api/host/chat/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageResDto>> hostMessages(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(chatService.getMessages(roomId, user.getMemberNo()));
    }

    @PatchMapping("/api/host/chat/rooms/{roomId}/read")
    public ResponseEntity<Void> hostMarkRead(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails user) {
        chatService.markAsRead(roomId, user.getMemberNo());
        return ResponseEntity.ok().build();
    }
}
