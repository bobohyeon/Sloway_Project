package com.sloway.app.payment.settlement.account.dto.request;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.payment.settlement.account.entity.AccountEntity;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AccountCreateReqDto {

    private String bankName;
    private String accountNo;
    private String holder;

    public AccountEntity toEntity(HostEntity hostEntity) {
        return AccountEntity.builder()
                .hostNo(hostEntity)
                .bankName(bankName)
                .accountNo(accountNo)
                .holder(holder)
                .build();
    }

}
