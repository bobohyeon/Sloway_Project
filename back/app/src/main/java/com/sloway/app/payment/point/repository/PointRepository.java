package com.sloway.app.payment.point.repository;

import com.sloway.app.payment.point.entity.PointEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<PointEntity, Long> , PointRepositoryCustom {

}
