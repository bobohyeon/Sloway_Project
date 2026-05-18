package com.sloway.app.host.repository;

import com.sloway.app.host.entity.HostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostRepository extends JpaRepository<HostEntity,Long>, HostRepositoryCustom {
}
