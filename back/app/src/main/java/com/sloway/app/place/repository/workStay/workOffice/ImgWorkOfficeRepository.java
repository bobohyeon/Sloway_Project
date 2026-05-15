package com.sloway.app.place.repository.workStay.workOffice;

import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
import com.sloway.app.place.entity.workStay.workOffice.ImgWorkStayOfficeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImgWorkOfficeRepository extends JpaRepository<ImgWorkStayOfficeEntity,Long>, ImgWorkOfficeRepositoryCustom {
    void deleteAllByWorkOfficeEntityNo(Long no);
}
