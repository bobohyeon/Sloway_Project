package com.sloway.app.admin.dto.response;

import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 어드민 — 호스트 목록 응답 (한 행).
 *
 * <p>목록 화면용 최소 정보. 상세 정보(전화번호·생년월일·서류 URL 등)는
 * 상세 조회 API에서 별도 DTO로 제공.
 *
 * <p>두 엔티티(HostEntity + MemberEntity)를 합쳐서 한 행 표현.
 * Service에서 두 엔티티 모두 조회 후 from(host, member) 호출.
 */
@Getter
@Builder
public class HostListResponseDto {

    // ─── 호스트 정보 (HostEntity) ──────────────
    private final Long hostNo;
    private final String businessName;
    private final String businessNo;
    private final ApprovalState approvalState;
    private final LocalDateTime createdAt;     // 신청일 (Host 생성 시각)

    // ─── 회원 정보 (MemberEntity) ──────────────
    private final String memberName;
    private final String memberEmail;


    /**
     * Entity 두 개에서 DTO 변환.
     * <p>Service에서 host와 그에 대응하는 member를 한 쌍으로 묶어 호출.
     */
    public static HostListResponseDto from(HostEntity host, MemberEntity member) {
        return HostListResponseDto.builder()
                .hostNo(host.getNo())
                .businessName(host.getBusinessName())
                .businessNo(host.getBusinessNo())
                .approvalState(host.getApprovalState())
                .createdAt(host.getCreatedAt())   // BaseEntity의 createdAt
                .memberName(member.getName())
                .memberEmail(member.getEmail())
                .build();
    }
}