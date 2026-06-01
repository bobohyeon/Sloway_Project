package com.sloway.app.payment.settlement.account.dto.response;

import com.sloway.app.payment.settlement.account.entity.AccountEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccountResDto {

    private Long no;
    private Long hostNo;
    private String bankName;
    private String accountNo;
    private String holder;

    public static AccountResDto from(AccountEntity accountEntity) {
        return AccountResDto.builder()
                .no(accountEntity.getNo())
                .hostNo(accountEntity.getHostNo().getNo())
                .bankName(accountEntity.getBankName())
                .accountNo(accountEntity.getAccountNo())
                .holder(accountEntity.getHolder())
                .build();

    }

}
