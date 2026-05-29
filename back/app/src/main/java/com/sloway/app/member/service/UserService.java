package com.sloway.app.member.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.dto.request.UpdateUserRequestDto;
import com.sloway.app.member.dto.response.UserResponseDto;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 일반회원 정보 관리 서비스  - 마이페이지
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final MemberRepository memberRepository;

    public UserResponseDto getMyInfo(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(
                        ()->new IllegalArgumentException("회원을 찾을 수 없습니다")
                );

        return UserResponseDto.from(member);
    }

    @Transactional
    public UserResponseDto update(Long memberNo, UpdateUserRequestDto request) {
        // 1) 회원 조회 (없으면 404)
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 2) 필드별 null 체크 후 변경 (PATCH = 보낸 필드만 변경)
        //    Entity 의미 메서드 호출 → 비즈니스 룰을 Entity가 책임
        if (request.getName() != null && !request.getName().isBlank()) {
            member.changeName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            member.changePhone(request.getPhone());
        }
        // imgUrl은 빈 문자열도 허용 (프로필 이미지 제거 의미)
        if (request.getImgUrl() != null) {
            member.changeImgUrl(request.getImgUrl());
        }

        log.info("일반회원 마이페이지 수정 완료: memberNo={}", memberNo);

        // 3) 수정 후 정보를 응답 DTO로 변환해서 반환
        return UserResponseDto.from(member);

    }
}
