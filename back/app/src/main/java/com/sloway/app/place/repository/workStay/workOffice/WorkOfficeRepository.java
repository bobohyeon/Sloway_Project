package com.sloway.app.place.repository.workStay.workOffice;

import com.sloway.app.place.entity.workStay.workOffice.WorkOfficeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkOfficeRepository extends JpaRepository<WorkOfficeEntity,Long>, WorkOfficeRepositoryCustom {
    Optional<WorkOfficeEntity> findByWorkStayEntityNo(Long workStayNo);


    List<WorkOfficeEntity> findAllByWorkStayEntityNo(Long workStayNo);

}
