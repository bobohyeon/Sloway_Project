package com.sloway.app.host.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 호스트 신청 입력.
 *
 * <p>일반회원 공통 정보 + 사업자 정보를 함께 받는다.
 * 승인 상태(approvalState)는 서버가 기본값(P)으로 설정 — 어드민 승인 대기.
 */
@Getter
@Setter
@NoArgsConstructor
public class HostJoinRequestDto {

    // 회원 공통 정보 (SignupRequestDto와 동일)
    private String email;
    private String password;
    private String name;
    private String phone;
    private String birthDate;

    // 사업자 정보 (호스트만)
    private String businessName;     // 상호명
    private String businessNo;       // 사업자등록번호 (10자리, unique)
    private String businessDocUrl;   // 사업자등록증 파일 URL
}