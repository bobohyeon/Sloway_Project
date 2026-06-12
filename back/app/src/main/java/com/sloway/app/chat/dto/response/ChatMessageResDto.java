package com.sloway.app.chat.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatMessageResDto {
    private Long id;
    private String content;
    private Long senderNo;
    private String senderName;
    private LocalDateTime createdAt;
}
