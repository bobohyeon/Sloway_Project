package com.sloway.app.admin.dto.response;

import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 어드민 — 회원 상세 응답.
 */
@Getter
@Builder
public class MemberDetailResponseDto {

    // ─── 기본 정보 ────────────────────────────
    private final Long memberNo;
    private final String email;
    private final String name;
    private final String phone;
    private final String birthDate;
    private final String imgUrl;
    private final MemberStatus status;
    private final LocalDateTime createdAt;
    private final  String role;

    // ─── 인증/제재 정보 ─────────────────────
    private final LocalDateTime verifiedAt;
    private final String suspendReason;
    private final LocalDateTime suspendUntil;


    public static MemberDetailResponseDto from(MemberEntity member ,String role) {
        return MemberDetailResponseDto.builder()
                .memberNo(member.getNo())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .birthDate(member.getBirthDate())
                .imgUrl(member.getImgUrl())
                .status(member.getStatus())
                .createdAt(member.getCreatedAt())
                .verifiedAt(member.getVerifiedAt())
                .suspendReason(member.getSuspendReason())
                .suspendUntil(member.getSuspendUntil())
                .role(role)
                .build();
    }
}