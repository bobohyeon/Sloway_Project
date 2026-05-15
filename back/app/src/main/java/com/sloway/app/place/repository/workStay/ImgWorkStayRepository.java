package com.sloway.app.place.repository.workStay;

import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImgWorkStayRepository extends JpaRepository<ImgWorkStayEntity,Long>, ImgWorkStayRepositoryCustom {
    void deleteAllByWorkStayEntityNo(Long no);
}
