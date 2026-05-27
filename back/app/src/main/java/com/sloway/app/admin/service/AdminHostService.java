package com.sloway.app.admin.service;


import com.sloway.app.admin.dto.response.HostDetailResponseDto;
import com.sloway.app.admin.dto.response.HostListResponseDto;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 어드민 — 호스트 관리 서비스.
 *
 * <p>호스트 신청의 승인/반려/자격취소 등 어드민이 호스트에 대해 수행하는
 * 모든 상태 변경 작업을 담는다.
 *
 * <h3>상태 전이 (ApprovalState)</h3>
 * <pre>
 *   P (대기)  ─ 승인 ─→ A (승인)
 *   P (대기)  ─ 반려 ─→ R (반려)
 *   A (승인)  ─ 회수 ─→ V (자격취소)   ← D4
 *   V        ─ 복원 ─→ A              ← D4
 * </pre>
 *
 * <p>모든 상태 변경은 HostEntity의 의미 메서드(approve/reject 등)에 위임.
 * Service는 "언제 호출 가능한가"(전이 규칙)만 검증.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminHostService {

    private final HostRepository hostRepository;
    private final MemberRepository memberRepository;

    /**
     * 호스트 신청 승인.
     *
     * <p>대기(P) 상태에서만 승인 가능. 이미 처리된 신청(A/R/V)이면 409 응답.
     */
    @Transactional
    public void approve(Long hostNo) {
        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        if (host.getApprovalState() != ApprovalState.P) {
            throw new CustomException(HostErrorCode.INVALID_APPROVAL_STATE);
        }

        host.approve();
        log.info("호스트 승인 완료: hostNo={}, memberNo={}", host.getNo(), host.getMemberNo());

    }

    /**
     * 호스트 신청 반려.
     *
     * <p>대기(P) 상태에서만 반려 가능. 사유는 필수 — 호스트에게 노출됨.
     */
    @Transactional
    public void reject(Long hostNo, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new CustomException(HostErrorCode.REJECT_REASON_REQUIRED);
        }

        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        if (host.getApprovalState() != ApprovalState.P) {
            throw new CustomException(HostErrorCode.INVALID_APPROVAL_STATE);
        }

        host.reject(reason);
        log.info("호스트 반려 완료: hostNo={}, memberNo={}, reason={}",
                host.getNo(), host.getMemberNo(), reason);
    }

    public Page<HostListResponseDto> findAll(ApprovalState state, int page, int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // 2) 상태 필터 분기: state 없으면 전체, 있으면 그 상태만
        Page<HostEntity> hostPage = (state == null)
                ? hostRepository.findAll(pageable)
                : hostRepository.findByApprovalState(state, pageable);
        // 3) 호스트들의 memberNo만 뽑아 리스트 만들기
        //    예: [Host(memberNo=5), Host(memberNo=7)] → [5, 7]
        List<Long> memberNos = hostPage.getContent().stream()
                .map(HostEntity::getMemberNo)
                .toList();

        // 4) 회원 정보 일괄 조회 (N+1 방지 — 쿼리 1번에 끝)
        List<MemberEntity> members = memberRepository.findByNoIn(memberNos);

        // 5) memberNo로 빠르게 Member 찾기 위한 Map 구성
        //    예: {5: Member5, 7: Member7}
        Map<Long, MemberEntity> memberMap = members.stream()
                .collect(Collectors.toMap(MemberEntity::getNo, m -> m));

        // 6) 각 호스트를 DTO로 변환 (memberMap에서 회원 정보 꺼내 합침)
        //    Page.map() — 페이징 메타(총 개수/페이지 수)는 유지하면서 내용만 변환
        return hostPage.map(host -> {
            MemberEntity member = memberMap.get(host.getMemberNo());

            // 방어: 회원 데이터 깨진 경우 (FK 위배). 정상이면 null 안 나옴.
            if (member == null) {
                throw new CustomException(HostErrorCode.HOST_NOT_FOUND);
            }

            return HostListResponseDto.from(host, member);
        });
    }
    //어드민 — 호스트 상세 조회.
    public HostDetailResponseDto findOne(Long hostNo) {

        // 1) 호스트 조회 (없으면 404)
        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 2) 회원 조회 — 정상 데이터에선 무조건 존재. 깨졌으면 404
        MemberEntity member = memberRepository.findById(host.getMemberNo())
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 3) DTO 변환
        return HostDetailResponseDto.from(host, member);
    }
}//class
