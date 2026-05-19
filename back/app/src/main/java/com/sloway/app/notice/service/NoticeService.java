package com.sloway.app.notice.service;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.admin.repository.AdminRepository;
import com.sloway.app.notice.dto.request.NoticeWriteReqDto;
import com.sloway.app.notice.entity.NoticeEntity;
import com.sloway.app.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final AdminRepository adminRepository;

    public void write(NoticeWriteReqDto reqDto) {

//        AdminEntity adminEntity = adminRepository.findByName(name)
//                .orElseThrow( ()-> new IllegalArgumentException("존재하지 않는 회원입니다.") );
        NoticeEntity noticeEntity = reqDto.toEntity();
        noticeRepository.save(noticeEntity);
//        log.info("[공지사항 작성 완료] writer : {}" , name);
    }
}
