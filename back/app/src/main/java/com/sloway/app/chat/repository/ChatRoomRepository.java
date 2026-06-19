package com.sloway.app.chat.repository;

import com.sloway.app.chat.entity.ChatRoomEntity;
import com.sloway.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {

    Optional<ChatRoomEntity> findByHostAndUserAndEntityNoAndPlaceType(MemberEntity host, MemberEntity user, Long entityNo, String placeType);

    List<ChatRoomEntity> findByUserOrderByCreatedAtDesc(MemberEntity user);

    List<ChatRoomEntity> findByHostOrderByCreatedAtDesc(MemberEntity host);
}
