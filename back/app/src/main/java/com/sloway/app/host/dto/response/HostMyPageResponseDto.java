package com.sloway.app.host.dto.response;

import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 호스트 — 본인 마이페이지 조회 응답.
 *
 * <p>회원 공통 정보(MemberEntity) + 사업자 정보(HostEntity) 합본.
 * 별도 신청 현황 API 없이 마이페이지 응답에 승인/반려 이력 함께 제공.
 * (신청 현황 조회 — D3 블록 2 예정).
 */
@Getter
@Builder
public class HostMyPageResponseDto {


    //회원 공통 정보
    private  final Long memberNo;
    private  final String email;
    private  final String name;
    private  final String phone;
    private  final String birthDate;
    private  final String imgUrl;
    private  final LocalDateTime createdAt;

    //호스트 사업자 정보
    private final Long hostNo;
    private final String businessName;
    private final String businessNo;
    private final String businessDocurl;
    private final ApprovalState approvalState;
    private final  LocalDateTime approvedAt;    // 승인 시각 (P/R 상태면 null)
    private final String rejectReason;          // 반려 사유 (P/R 상태면 null)

    public static HostMyPageResponseDto from(MemberEntity member, HostEntity host){
        return HostMyPageResponseDto.builder()
                .memberNo(member.getNo())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .birthDate(member.getBirthDate())
                .imgUrl(member.getImgUrl())
                .createdAt(member.getCreatedAt())
                .hostNo(host.getNo())
                .businessName(host.getBusinessName())
                .businessNo(host.getBusinessNo())
                .businessDocurl(host.getBusinessDocUrl())
                .approvalState(host.getApprovalState())
                .approvedAt(host.getApprovedAt())
                .rejectReason(host.getRejectReason())
                .build();
    }
}
