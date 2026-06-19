package com.sloway.app.chat.service;

import com.sloway.app.chat.dto.response.ChatMessageResDto;
import com.sloway.app.chat.dto.response.ChatRoomResDto;
import com.sloway.app.chat.entity.ChatEntity;
import com.sloway.app.chat.entity.ChatRoomEntity;
import com.sloway.app.chat.exception.ChatErrorCode;
import com.sloway.app.chat.repository.ChatRepository;
import com.sloway.app.chat.repository.ChatRoomRepository;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;
    private final RsvnRepository rsvnRepository;
    private final MemberRepository memberRepository;
    private final HostPlaceRepository hostPlaceRepository;
    private final WorkStayRepository workStayRepository;
    private final OfficeRepository officeRepository;
    private final StationRepository stationRepository;

    /** 예약 기반으로 채팅방 생성 또는 기존 방 반환 */
    @Transactional
    public ChatRoomResDto getOrCreateRoom(Long rsvnNo, Long requesterMemberNo) {
        RsvnEntity rsvn = rsvnRepository.findById(rsvnNo)
                .orElseThrow(() -> new CustomException(ChatErrorCode.RESERVATION_NOT_FOUND));

        MemberEntity userMember = rsvn.getMemberNo();

        // 공간으로 호스트 조회 + entityNo/placeType 추출
        Optional<HostPlaceEntity> hostPlaceOpt = Optional.empty();
        String spaceName = null;
        Long entityNo = null;
        String placeType = null;
        // entityNo는 PlaceEntity.no 기준으로 통일 (공간 검색 경로와 동일)
        if (rsvn.getWorkStayNo() != null) {
            hostPlaceOpt = hostPlaceRepository.findByWorkStayEntity(rsvn.getWorkStayNo());
            spaceName = rsvn.getWorkStayNo().getPlaceEntity().getTitle();
            entityNo = rsvn.getWorkStayNo().getPlaceEntity().getNo();
            placeType = "WORK_STAY";
        } else if (rsvn.getOfficeNo() != null) {
            hostPlaceOpt = hostPlaceRepository.findByOfficeEntity(rsvn.getOfficeNo());
            spaceName = rsvn.getOfficeNo().getPlaceEntity().getTitle();
            entityNo = rsvn.getOfficeNo().getPlaceEntity().getNo();
            placeType = "OFFICE";
        } else if (rsvn.getStationNo() != null) {
            hostPlaceOpt = hostPlaceRepository.findByStationEntity(rsvn.getStationNo());
            spaceName = rsvn.getStationNo().getPlaceEntity().getTitle();
            entityNo = rsvn.getStationNo().getPlaceEntity().getNo();
            placeType = "STATION";
        }

        HostPlaceEntity hostPlace = hostPlaceOpt
                .orElseThrow(() -> new CustomException(ChatErrorCode.HOST_NOT_FOUND));

        MemberEntity hostMember = memberRepository.findById(hostPlace.getHostEntity().getMemberNo())
                .orElseThrow(() -> new CustomException(ChatErrorCode.MEMBER_NOT_FOUND));

        final String finalSpaceName = spaceName;
        final Long finalEntityNo = entityNo;
        final String finalPlaceType = placeType;

        // 공간별로 분리된 방 조회(나간 경우 rejoin) 또는 신규 생성
        ChatRoomEntity room = chatRoomRepository
                .findByHostAndUserAndEntityNoAndPlaceType(hostMember, userMember, finalEntityNo, finalPlaceType)
                .map(r -> { r.rejoin(); return r; })
                .orElseGet(() -> chatRoomRepository.save(
                        ChatRoomEntity.builder()
                                .host(hostMember)
                                .user(userMember)
                                .spaceName(finalSpaceName)
                                .entityNo(finalEntityNo)
                                .placeType(finalPlaceType)
                                .build()));

        return buildRoomRes(room, requesterMemberNo);
    }

    /** 공간(entityNo + placeType) 기반으로 채팅방 생성 또는 기존 방 반환 */
    @Transactional
    public ChatRoomResDto getOrCreateRoomByPlace(Long entityNo, String placeType, Long requesterMemberNo) {
        Optional<HostPlaceEntity> hostPlaceOpt;
        String spaceName;

        // entityNo는 각 엔티티 자체 PK (station.no / workStay.no / office.no)
        switch (placeType.toUpperCase()) {
            case "WORK_STAY" -> {
                WorkStayEntity ws = workStayRepository.findById(entityNo)
                        .orElseThrow(() -> new CustomException(ChatErrorCode.PLACE_NOT_FOUND));
                hostPlaceOpt = hostPlaceRepository.findByWorkStayEntity(ws);
                spaceName = ws.getTitle();
            }
            case "OFFICE" -> {
                OfficeEntity office = officeRepository.findById(entityNo)
                        .orElseThrow(() -> new CustomException(ChatErrorCode.PLACE_NOT_FOUND));
                hostPlaceOpt = hostPlaceRepository.findByOfficeEntity(office);
                spaceName = office.getTitle();
            }
            case "STATION" -> {
                StationEntity station = stationRepository.findById(entityNo)
                        .orElseThrow(() -> new CustomException(ChatErrorCode.PLACE_NOT_FOUND));
                hostPlaceOpt = hostPlaceRepository.findByStationEntity(station);
                spaceName = station.getTitle();
            }
            default -> throw new CustomException(ChatErrorCode.PLACE_NOT_FOUND);
        }

        HostPlaceEntity hostPlace = hostPlaceOpt
                .orElseThrow(() -> new CustomException(ChatErrorCode.HOST_NOT_FOUND));

        MemberEntity hostMember = memberRepository.findById(hostPlace.getHostEntity().getMemberNo())
                .orElseThrow(() -> new CustomException(ChatErrorCode.MEMBER_NOT_FOUND));

        MemberEntity userMember = getMember(requesterMemberNo);
        final String finalSpaceName = spaceName;
        final Long finalEntityNo = entityNo;
        final String finalPlaceType = placeType.toUpperCase();

        ChatRoomEntity room = chatRoomRepository
                .findByHostAndUserAndEntityNoAndPlaceType(hostMember, userMember, finalEntityNo, finalPlaceType)
                .map(r -> { r.rejoin(); return r; })
                .orElseGet(() -> chatRoomRepository.save(
                        ChatRoomEntity.builder()
                                .host(hostMember)
                                .user(userMember)
                                .spaceName(finalSpaceName)
                                .entityNo(finalEntityNo)
                                .placeType(finalPlaceType)
                                .build()));

        return buildRoomRes(room, requesterMemberNo);
    }

    /** 채팅방 나가기 — 나간 사람의 목록에서 숨김 */
    @Transactional
    public void leaveRoom(Long roomId, Long memberNo) {
        ChatRoomEntity room = getRoom(roomId);
        verifyAccess(room, memberNo);
        if (room.getHost().getNo().equals(memberNo)) {
            room.leaveAsHost();
        } else {
            room.leaveAsUser();
        }
    }

    /** USER 전체 읽지 않은 메시지 수 */
    public long getTotalUnreadForUser(Long memberNo) {
        MemberEntity member = getMember(memberNo);
        return chatRoomRepository.findByUserOrderByCreatedAtDesc(member).stream()
                .filter(r -> !r.isUserLeft())
                .mapToLong(r -> chatRepository.countByChatRoomAndSenderNotAndReadAtIsNull(r, member))
                .sum();
    }

    /** HOST 전체 읽지 않은 메시지 수 */
    public long getTotalUnreadForHost(Long memberNo) {
        MemberEntity member = getMember(memberNo);
        return chatRoomRepository.findByHostOrderByCreatedAtDesc(member).stream()
                .filter(r -> !r.isHostLeft())
                .mapToLong(r -> chatRepository.countByChatRoomAndSenderNotAndReadAtIsNull(r, member))
                .sum();
    }

    /** USER 기준 채팅방 목록 */
    public List<ChatRoomResDto> getRoomsForUser(Long memberNo) {
        MemberEntity member = getMember(memberNo);
        return chatRoomRepository.findByUserOrderByCreatedAtDesc(member).stream()
                .filter(r -> !r.isUserLeft())
                .map(r -> buildRoomRes(r, memberNo))
                .toList();
    }

    /** HOST 기준 채팅방 목록 */
    public List<ChatRoomResDto> getRoomsForHost(Long memberNo) {
        MemberEntity member = getMember(memberNo);
        return chatRoomRepository.findByHostOrderByCreatedAtDesc(member).stream()
                .filter(r -> !r.isHostLeft())
                .map(r -> buildRoomRes(r, memberNo))
                .toList();
    }

    /** 메시지 목록 조회 (접근 권한 검증 포함) */
    @Transactional
    public List<ChatMessageResDto> getMessages(Long roomId, Long requesterMemberNo) {
        ChatRoomEntity room = getRoom(roomId);
        verifyAccess(room, requesterMemberNo);

        // 조회 시 상대방 메시지 읽음 처리
        MemberEntity reader = getMember(requesterMemberNo);
        markUnread(room, reader);

        return chatRepository.findByChatRoomOrderByCreatedAtAsc(room).stream()
                .map(this::toMessageDto)
                .toList();
    }

    /** WebSocket 또는 REST에서 메시지 저장 */
    @Transactional
    public ChatMessageResDto saveMessage(Long roomId, String content, Long senderMemberNo) {
        ChatRoomEntity room = getRoom(roomId);
        MemberEntity sender = getMember(senderMemberNo);
        verifyAccess(room, senderMemberNo);

        // 상대방이 나간 상태면 메시지 수신 시 목록에 다시 표시
        if (room.getHost().getNo().equals(senderMemberNo)) {
            room.rejoinUser();
        } else {
            room.rejoinHost();
        }

        ChatEntity chat = chatRepository.save(
                ChatEntity.builder()
                        .chatRoom(room)
                        .sender(sender)
                        .content(content)
                        .build());

        return toMessageDto(chat);
    }

    /** 읽음 처리 */
    @Transactional
    public void markAsRead(Long roomId, Long readerMemberNo) {
        ChatRoomEntity room = getRoom(roomId);
        verifyAccess(room, readerMemberNo);
        MemberEntity reader = getMember(readerMemberNo);
        markUnread(room, reader);
    }

    // ─── private helpers ──────────────────────────────────────────────────────

    private void markUnread(ChatRoomEntity room, MemberEntity reader) {
        chatRepository.findByChatRoomAndSenderNotAndReadAtIsNull(room, reader)
                .forEach(ChatEntity::markAsRead);
    }

    private ChatRoomResDto buildRoomRes(ChatRoomEntity room, Long viewerMemberNo) {
        boolean isHost = room.getHost().getNo().equals(viewerMemberNo);
        String counterpartName = isHost
                ? room.getUser().getName()
                : room.getHost().getName();

        MemberEntity viewer = isHost ? room.getHost() : room.getUser();

        Optional<ChatEntity> last = chatRepository.findTopByChatRoomOrderByCreatedAtDesc(room);
        long unread = chatRepository.countByChatRoomAndSenderNotAndReadAtIsNull(room, viewer);

        return ChatRoomResDto.builder()
                .roomId(room.getId())
                .counterpartName(counterpartName)
                .spaceName(room.getSpaceName())
                .lastMessage(last.map(ChatEntity::getContent).orElse(null))
                .lastMessageTime(last.map(ChatEntity::getCreatedAt).orElse(null))
                .unreadCount(unread)
                .build();
    }

    private ChatMessageResDto toMessageDto(ChatEntity entity) {
        return ChatMessageResDto.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .senderNo(entity.getSender().getNo())
                .senderName(entity.getSender().getName())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private ChatRoomEntity getRoom(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ChatErrorCode.ROOM_NOT_FOUND));
    }

    private MemberEntity getMember(Long memberNo) {
        return memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(ChatErrorCode.MEMBER_NOT_FOUND));
    }

    private void verifyAccess(ChatRoomEntity room, Long memberNo) {
        boolean allowed = room.getHost().getNo().equals(memberNo)
                || room.getUser().getNo().equals(memberNo);
        if (!allowed) {
            throw new CustomException(ChatErrorCode.ACCESS_DENIED);
        }
    }
}
