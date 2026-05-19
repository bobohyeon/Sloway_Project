package com.sloway.app.member.dto.response;

import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {

    private final Long memberNo;
    private final String email;
    private final String name;
    private final String phone;
    private final String birthDate;
    private final String imgUrl;

    public static UserResponseDto from(MemberEntity member) {
        return UserResponseDto.builder()
                .memberNo(member.getNo())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .birthDate(member.getBirthDate())
                .imgUrl(member.getImgUrl())
                .build();
    }

}
