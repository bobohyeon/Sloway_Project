package com.sloway.app.member.dto.response;

import com.sloway.app.member.entity.SocialAccount;
import lombok.Builder;
import lombok.Getter;

/** 연동된 소셜 계정 정보 (마이페이지 표시용) */
@Getter
@Builder
public class SocialAccountResponseDto {

    private String provider;      // "KAKAO", "GOOGLE" (enum의 code)

    public static SocialAccountResponseDto from(SocialAccount entity) {
        return SocialAccountResponseDto.builder()
                .provider(entity.getProvider().getCode())  // K → "KAKAO"
                .build();
    }
}