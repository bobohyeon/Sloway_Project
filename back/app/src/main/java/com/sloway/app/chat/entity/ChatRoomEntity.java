package com.sloway.app.chat.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CHAT_ROOM")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ChatRoomEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "HOST_MEMBER_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity host;

    @JoinColumn(name = "USER_MEMBER_ID" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity user;
}
