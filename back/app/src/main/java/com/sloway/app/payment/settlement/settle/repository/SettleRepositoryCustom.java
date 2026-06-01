package com.sloway.app.payment.settlement.settle.repository;

import com.sloway.app.payment.settlement.settle.entity.SettleEntity;

import java.util.Optional;

public interface SettleRepositoryCustom {

    Optional<SettleEntity> findLatestByHostNo(Long hostNo);

    // TODO: findByHostNo — 이 host 의 정산 "목록"(최근순) 시그니처 (호스트 정산 이력 화면용)
    //   findLatestByHostNo 와 거의 동일하나 반환이 List<SettleEntity> (단건/Optional 아님)
    //   ※ import java.util.List 필요

}
