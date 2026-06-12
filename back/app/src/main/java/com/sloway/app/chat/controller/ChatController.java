package com.sloway.app.chat.controller;

import com.sloway.app.chat.dto.ChatMessageWsDto;
import com.sloway.app.chat.dto.response.ChatMessageResDto;
import com.sloway.app.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessageSendingOperations simpMessageSendingOperations;
    private final ChatService chatService;

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        System.out.println("WebSocket connected: " + event);
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        System.out.println("WebSocket disconnected: " + event);
    }

    @MessageMapping("/{roomId}")
    public void handleMsg(@DestinationVariable Long roomId, ChatMessageWsDto dto) {
        ChatMessageResDto saved = chatService.saveMessage(roomId, dto.getContent(), dto.getSenderNo());
        simpMessageSendingOperations.convertAndSend("/sub/" + roomId, saved);
    }
}
