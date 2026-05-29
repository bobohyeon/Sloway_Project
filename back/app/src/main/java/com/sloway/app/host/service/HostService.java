package com.sloway.app.host.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.dto.response.HostMyPageResponseDto;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 호스트 — 본인 영역 서비스.
 *
 * <p>호스트가 자기 정보를 조회/수정/탈퇴할 때 사용.
 * 어드민 시점의 호스트 관리는 AdminHostService에서 별도 처리.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HostService {

    private final MemberRepository memberRepository;
    private final HostRepository hostRepository;


    public HostMyPageResponseDto hostMyInfo(Long memberNo) {
        // 1) 회원 조회 (없으면 404)
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()-> new CustomException(HostErrorCode.MEMBER_NOT_FOUND));
        // 2) 호스트 조회 — memberNo가 외래키
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(()-> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 3) DTO 변환
        return HostMyPageResponseDto.from(member,host);

    }
}
