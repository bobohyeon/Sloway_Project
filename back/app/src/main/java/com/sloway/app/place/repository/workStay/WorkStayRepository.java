package com.sloway.app.place.repository.workStay;

import com.sloway.app.place.entity.workStay.WorkStayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkStayRepository extends JpaRepository<WorkStayEntity, Long>, WorkStayRepositoryCustom {
}
