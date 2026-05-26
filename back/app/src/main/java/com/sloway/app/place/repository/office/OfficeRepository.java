package com.sloway.app.place.repository.office;

import com.sloway.app.place.entity.office.OfficeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficeRepository extends JpaRepository<OfficeEntity, Long>, OfficeRepositoryCustom {
}
