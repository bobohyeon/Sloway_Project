package com.sloway.app.payment.settlement.account.repository;

import com.sloway.app.payment.settlement.account.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<AccountEntity, Long>, AccountRepositoryCustom {


}
