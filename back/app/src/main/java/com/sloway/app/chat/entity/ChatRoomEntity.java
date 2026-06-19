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

    @Column(length = 200)
    private String spaceName;

    @Column(name = "ENTITY_NO")
    private Long entityNo;

    @Column(name = "PLACE_TYPE", length = 20)
    private String placeType;

    @Builder.Default
    @Column(name = "USER_LEFT", nullable = false)
    private boolean userLeft = false;

    @Builder.Default
    @Column(name = "HOST_LEFT", nullable = false)
    private boolean hostLeft = false;

    public void leaveAsUser()  { this.userLeft = true; }
    public void leaveAsHost()  { this.hostLeft = true; }
    public void rejoin()       { this.userLeft = false; this.hostLeft = false; }
    public void rejoinUser()   { this.userLeft = false; }
    public void rejoinHost()   { this.hostLeft = false; }
}
