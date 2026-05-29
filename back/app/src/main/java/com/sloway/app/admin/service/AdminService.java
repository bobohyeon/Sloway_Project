package com.sloway.app.admin.service;

import com.sloway.app.admin.common.AdminErrorCode;
import com.sloway.app.admin.dto.request.UpdateAdminRequestDto;
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
        return AdminMyPageResponseDto.from(admin);
    }

    @Transactional
    public AdminMyPageResponseDto update(Long adminNo, UpdateAdminRequestDto request) {

        // 1) 어드민 조회 (없으면 404)
        AdminEntity admin = adminRepository.findById(adminNo)
                .orElseThrow(() -> new CustomException(AdminErrorCode.ADMIN_NOT_FOUND));

        // 2) 필드별 null 체크 후 변경 (PATCH)
        if (request.getName() != null && !request.getName().isBlank()) {
            admin.changeName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            admin.changePhone(request.getPhone());
        }

        log.info("어드민 본인 정보 수정 완료: adminNo={}", adminNo);

        return AdminMyPageResponseDto.from(admin);
    }
}//class
