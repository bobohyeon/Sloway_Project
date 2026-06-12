package com.sloway.app.chat.repository;

import com.sloway.app.chat.entity.ChatEntity;
import com.sloway.app.chat.entity.ChatRoomEntity;
import com.sloway.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

    List<ChatEntity> findByChatRoomOrderByCreatedAtAsc(ChatRoomEntity chatRoom);

    Optional<ChatEntity> findTopByChatRoomOrderByCreatedAtDesc(ChatRoomEntity chatRoom);

    long countByChatRoomAndSenderNotAndReadAtIsNull(ChatRoomEntity chatRoom, MemberEntity sender);

    List<ChatEntity> findByChatRoomAndSenderNotAndReadAtIsNull(ChatRoomEntity chatRoom, MemberEntity sender);
}
