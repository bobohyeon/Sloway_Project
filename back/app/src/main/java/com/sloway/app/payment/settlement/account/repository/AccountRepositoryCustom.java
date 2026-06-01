package com.sloway.app.payment.settlement.account.repository;

import com.sloway.app.payment.settlement.account.entity.AccountEntity;

public interface AccountRepositoryCustom {

    AccountEntity findByHostNo(Long hostNo);


}
