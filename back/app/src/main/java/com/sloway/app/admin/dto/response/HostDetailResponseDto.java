package com.sloway.app.admin.dto.response;

import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 어드민 — 호스트 상세 응답.
 *
 * <p>목록(HostListResponseDto) 대비 추가 정보:
 * <ul>
 *   <li>businessDocUrl — 사업자등록증 서류 URL (검토용)</li>
 *   <li>approvedAt    — 승인 시각 (승인된 경우)</li>
 *   <li>rejectReason  — 반려 사유 (반려된 경우)</li>
 *   <li>memberPhone, memberBirthDate — 회원 추가 정보</li>
 * </ul>
 */
@Getter
@Builder
public class HostDetailResponseDto {

    // ─── 호스트 정보 (HostEntity) ──────────────
    private final Long hostNo;
    private final String businessName;
    private final String businessNo;
    private final String businessDocUrl;          // 검토용 서류
    private final ApprovalState approvalState;
    private final LocalDateTime createdAt;        // 신청일
    private final LocalDateTime approvedAt;       // 승인 시각 (null 가능)
    private final String rejectReason;            // 반려 사유 (null 가능)

    // ─── 회원 정보 (MemberEntity) ──────────────
    private final String memberName;
    private final String memberEmail;
    private final String memberPhone;             // 추가
    private final String memberBirthDate;         // 추가


    /**
     * Entity 두 개 → DTO.
     */
    public static HostDetailResponseDto from(HostEntity host, MemberEntity member) {
        return HostDetailResponseDto.builder()
                .hostNo(host.getNo())
                .businessName(host.getBusinessName())
                .businessNo(host.getBusinessNo())
                .businessDocUrl(host.getBusinessDocUrl())
                .approvalState(host.getApprovalState())
                .createdAt(host.getCreatedAt())
                .approvedAt(host.getApprovedAt())
                .rejectReason(host.getRejectReason())
                .memberName(member.getName())
                .memberEmail(member.getEmail())
                .memberPhone(member.getPhone())
                .memberBirthDate(member.getBirthDate())
                .build();
    }
}