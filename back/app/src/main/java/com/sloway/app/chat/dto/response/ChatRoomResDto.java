package com.sloway.app.chat.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatRoomResDto {
    private Long roomId;
    private String counterpartName;
    private String spaceName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
}
