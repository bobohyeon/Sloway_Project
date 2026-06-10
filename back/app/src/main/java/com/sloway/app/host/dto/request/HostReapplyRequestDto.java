package com.sloway.app.host.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 호스트 재신청 입력.
 *
 * 반려된 호스트가 사업자 정보를 보완해 다시 신청할 때 사용.
 * 회원 공통 정보(이메일·비번 등)는 이미 존재하므로 받지 않는다.
 * 사업자등록증 파일은 별도 MultipartFile로 받는다.
 */
@Getter
@Setter
@NoArgsConstructor
public class HostReapplyRequestDto {

    private String businessName;
    private String businessNo;
}