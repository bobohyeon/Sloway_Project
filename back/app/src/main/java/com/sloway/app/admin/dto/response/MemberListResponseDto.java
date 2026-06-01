package com.sloway.app.admin.dto.response;

import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 어드민 — 회원 목록 응답 (한 행).
 *
 */
@Getter
@Builder
public class MemberListResponseDto {

    private final Long memberNo;
    private final String email;
    private final String name;
    private final String phone;
    private final MemberStatus status;
    private final LocalDateTime createdAt;   // 가입일
    private final String role;


    public static MemberListResponseDto from(MemberEntity member , String role) {
        return MemberListResponseDto.builder()
                .memberNo(member.getNo())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .status(member.getStatus())
                .createdAt(member.getCreatedAt())
                .role(role)
                .build();
    }
}