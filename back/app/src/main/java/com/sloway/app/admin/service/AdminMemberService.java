package com.sloway.app.admin.service;

import com.sloway.app.admin.common.AdminErrorCode;
import com.sloway.app.admin.dto.response.MemberDetailResponseDto;
import com.sloway.app.admin.dto.response.MemberListResponseDto;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * 어드민 — 회원 관리 서비스.
 *
 * <p>회원 목록/상세 조회 + 정지/해제 처리.
 * Member 도메인의 모든 어드민 액션을 여기서 담당.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class AdminMemberService {
    private final MemberRepository memberRepository;
    private final HostRepository hostRepository;

    //회원 목록 조회
    public Page<MemberListResponseDto> findAll(MemberStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<MemberEntity> memberPage = (status == null)
                ? memberRepository.findAll(pageable)
                : memberRepository.findByStatus(status, pageable);

        // 이 페이지 회원들 중 호스트인 memberNo를 한 번에 조회 (N+1 방지)
        List<Long> memberNos = memberPage.getContent().stream()
                .map(MemberEntity::getNo)
                .toList();
        Set<Long> hostMemberNos = hostRepository.findMemberNosByMemberNoIn(memberNos);

        // 각 회원: 호스트 Set에 있으면 HOST, 없으면 USER
        return memberPage.map(member ->
                MemberListResponseDto.from(
                        member,
                        hostMemberNos.contains(member.getNo()) ? "HOST" : "USER"
                ));
    }

    //회원 상세 조회
    public MemberDetailResponseDto findOne(Long memberNo) {

        // 회원 조회 — 없으면 404
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        String role = hostRepository.existsByMemberNo(memberNo) ? "HOST" : "USER";
        return MemberDetailResponseDto.from(member, role);
    }

    //회원정지
    @Transactional
    public void suspend(Long memberNo, String reason, Integer days) {

        // 1) 사유 검증 — DB 조회 전에 빠르게 실패
        if (reason == null || reason.isBlank()) {
            throw new CustomException(MemberErrorCode.SUSPEND_REASON_REQUIRED);
        }

        // 2) 회원 조회
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 3) 활성 상태가 아니면 정지 불가 — 이미 정지/탈퇴 회원은 거절
        if (member.getStatus() != MemberStatus.A) {
            throw new CustomException(MemberErrorCode.INVALID_MEMBER_STATE);
        }

        // 4) 정지 해제 시각 계산 — days가 null/음수면 영구(null), 양수면 미래 시각
        LocalDateTime until = (days == null || days < 0)
                ? null
                : LocalDateTime.now().plusDays(days);

        // 5) Entity 의미 메서드 호출 (status 전환 + 사유/시각 저장)
        member.suspend(reason, until);

        log.info("회원 정지 완료: memberNo={}, days={}, until={}, reason={}",
                memberNo, days, until, reason);
    }

    //회원 정지 해제
    @Transactional
    public void unsuspend(Long memberNo) {

        // 1) 회원 조회
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 2) 정지 상태(S/B)가 아니면 해제 불가
        MemberStatus current = member.getStatus();
        if (current != MemberStatus.S && current != MemberStatus.B) {
            throw new CustomException(MemberErrorCode.INVALID_MEMBER_STATE);
        }

        // 3) Entity 의미 메서드 호출 (status A로 복원 + 사유/시각 초기화)
        member.unsuspend();

        log.info("회원 정지 해제 완료: memberNo={}", memberNo);
    }

}//class
