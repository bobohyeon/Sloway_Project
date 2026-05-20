package com.sloway.app.payment.point.dto.response;

import com.sloway.app.member.entity.MemberEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointBalanceResDto {

    private Long memberNo;
    private Integer balance;

    public static PointBalanceResDto from(MemberEntity memberEntity, Integer balance) {
        return PointBalanceResDto.builder()
                .memberNo(memberEntity.getNo())
                .balance(balance)
                .build();
    }

}
