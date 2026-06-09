package com.sloway.app.chat.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHAT")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ChatEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @JoinColumn(name = "CHAT_ROOM_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoomEntity chatRoom;

    @JoinColumn(name = "MEMBER_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity sender;

    @Column(name = "READ_AT")
    private LocalDateTime readAt;

    public void markAsRead() {
        this.readAt = LocalDateTime.now();
    }

}
