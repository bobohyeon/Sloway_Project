package com.sloway.app.chat;

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

    @EventListener
    public void handleConnect(SessionConnectedEvent event){
        System.out.println("event = " + event);
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event){
        System.out.println("ChatController.handleDisconnect");
        System.out.println("event = " + event);
    }

    @MessageMapping("/{topicId}")
    public void handleMsg(@DestinationVariable String topicId , ChatVo vo){
        System.out.println("vo = " + vo);
        simpMessageSendingOperations.convertAndSend("/sub/" + topicId , vo);

    }


}
