package com.sloway.app.payment.point.repository;

import com.sloway.app.payment.point.common.PointStatus;

public interface PointRepositoryCustom {

    Integer sumByMemberAndStatus(Long memberNo, PointStatus status);

}
