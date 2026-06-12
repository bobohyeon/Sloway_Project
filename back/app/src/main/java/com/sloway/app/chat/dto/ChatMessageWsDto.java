package com.sloway.app.chat.dto;

import lombok.Data;

@Data
public class ChatMessageWsDto {
    private Long roomId;
    private String content;
    private Long senderNo;
}
