package com.sloway.app.host.dto.response;

import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.entity.HostEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class HostApplicationResponseDto {

    private final String businessName;
    private final String businessNo;
    private final ApprovalState approvalState;   // P/A/R/V
    private final LocalDateTime createdAt;       // 신청일
    private final LocalDateTime approvedAt;      // 승인 시각 (null 가능)
    private final String rejectReason;           // 반려/박탈 사유 (null 가능)

    public static HostApplicationResponseDto from(HostEntity host) {
        return HostApplicationResponseDto.builder()
                .businessName(host.getBusinessName())
                .businessNo(host.getBusinessNo())
                .approvalState(host.getApprovalState())
                .createdAt(host.getCreatedAt())
                .approvedAt(host.getApprovedAt())
                .rejectReason(host.getRejectReason())
                .build();
    }
}