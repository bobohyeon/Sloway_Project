package com.sloway.app.notice.repository;

import com.sloway.app.notice.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<NoticeEntity , Long>, NoticeRepositoryCustom {
    List<NoticeEntity> findAllByIdInAndDelYn(List<Long> ids, String n);

    Optional<NoticeEntity> findByIdAndDelYn(Long id, String n);
}
