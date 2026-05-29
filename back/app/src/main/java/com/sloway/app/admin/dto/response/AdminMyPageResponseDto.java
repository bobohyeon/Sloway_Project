package com.sloway.app.admin.dto.response;

import com.sloway.app.admin.entity.AdminEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 어드민 — 본인 정보 조회 응답.
 *
 * <p>Admin은 Member 체계와 분리된 독립 테이블이라 단일 조회로 끝.
 * 호스트/일반회원 마이페이지와 달리 조인 없음.
 *
 * <p>비밀번호는 절대 노출 안 함.
 */
@Getter
@Builder
public class AdminMyPageResponseDto {

    private final Long adminNo;
    private final String email;
    private final String name;
    private final String phone;
    private final LocalDateTime createdAt;

    public static AdminMyPageResponseDto fron(AdminEntity admin){
        return AdminMyPageResponseDto.builder()
                .adminNo(admin.getNo())
                .email(admin.getEmail())
                .name(admin.getName())
                .phone(admin.getPhone())
                .createdAt(admin.getCreatedAt())
                .build();
    }

}
