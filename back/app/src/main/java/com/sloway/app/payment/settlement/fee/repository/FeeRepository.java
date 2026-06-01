package com.sloway.app.payment.settlement.fee.repository;

import com.sloway.app.payment.settlement.fee.common.PlaceType;
import com.sloway.app.payment.settlement.fee.entity.FeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeeRepository extends JpaRepository<FeeEntity, Long> {

    Optional<FeeEntity> findByPlaceTypeAndDelYn(PlaceType placeType, String delYn);

}
