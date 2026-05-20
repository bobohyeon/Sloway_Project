package com.sloway.app.payment.point.repository;

import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;

import java.util.List;

public interface PointRepositoryCustom {

    Integer sumByMemberAndStatus(Long memberNo, PointStatus status);

    List<PointEntity> findByPayAndDealType(Long payNo, PointDealType dealType);


}
