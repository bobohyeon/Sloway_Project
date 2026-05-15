package com.sloway.app.place.repository.office;

import com.sloway.app.place.entity.office.ImgOfficeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImgOfficeRepository extends JpaRepository<ImgOfficeEntity,Long>, ImgOfficeRepositoryCustom {
}
