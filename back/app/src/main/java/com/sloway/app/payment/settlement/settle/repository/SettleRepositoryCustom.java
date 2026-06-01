package com.sloway.app.payment.settlement.settle.repository;

import com.sloway.app.payment.settlement.settle.entity.SettleEntity;

import java.util.Optional;

public interface SettleRepositoryCustom {

    Optional<SettleEntity> findLatestByHostNo(Long hostNo);

}
