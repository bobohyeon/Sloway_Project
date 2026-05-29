package com.sloway.app.admin.service;

import com.sloway.app.admin.common.AdminErrorCode;
import com.sloway.app.admin.dto.response.AdminMyPageResponseDto;
import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.admin.repository.AdminRepository;
import com.sloway.app.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 어드민 — 본인 영역 서비스.
 *
 * <p>어드민이 자기 정보 조회/수정/비번변경할 때 사용.
 * Admin은 Member 체계와 분리된 독립 테이블이라 조인 없이 단일 조회.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {
    private final AdminRepository adminRepository;

    public AdminMyPageResponseDto getMyInfo(Long adminNo) {
        AdminEntity admin = adminRepository.findById(adminNo)
                .orElseThrow(()-> new CustomException(AdminErrorCode.ADMIN_NOT_FOUND));
        return AdminMyPageResponseDto.fron(admin);
    }

}//class
