package com.sloway.app.reservation.rsvn.repository;

import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RsvnRepository extends JpaRepository<RsvnEntity, Long> {
}