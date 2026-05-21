package com.sloway.app.notice.repository;

import com.sloway.app.notice.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<NoticeEntity , Long>, NoticeRepositoryCustom {
}
