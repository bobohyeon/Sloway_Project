package com.sloway.app.payment.settlement.fee.repository;

import com.sloway.app.payment.settlement.fee.common.PlaceType;
import com.sloway.app.payment.settlement.fee.entity.FeeEntity;

import java.time.LocalDateTime;
import java.util.Optional;

public interface FeeRepositoryCustom {

    Optional<FeeEntity> findValidFee(PlaceType placeType, LocalDateTime date);
}
