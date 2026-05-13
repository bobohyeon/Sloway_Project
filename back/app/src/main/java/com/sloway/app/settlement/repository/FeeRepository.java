package com.sloway.app.settlement.repository;

import com.sloway.app.settlement.entity.FeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeRepository extends JpaRepository<FeeEntity, Long> {
}
