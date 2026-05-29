package com.sloway.app.member.service;

import com.sloway.app.auth.dto.request.ChangePasswordRequestDto;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.dto.request.UpdateUserRequestDto;
import com.sloway.app.member.dto.response.UserResponseDto;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


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

    /**
     * 일반회원 비밀번호 변경.
     *
     * <p>비밀번호는 UserEntity에 BCrypt 해시로 저장됨 (Member 아님).
     *
     * @throws CustomException 현재 비번 불일치 / 새 비번이 기존과 동일 / 길이 부족 시
     */
    @Transactional
    public void changePassword(Long memberNo, ChangePasswordRequestDto request) {

        // 1) 새 비번 길이 검증 (4자 이상)
        if (request.getNewPassword() == null || request.getNewPassword().length() < 4) {
            throw new CustomException(MemberErrorCode.PASSWORD_TOO_SHORT);
        }

        // 2) UserEntity 조회 (비번은 여기에 저장됨)
        UserEntity user = userRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 3) 현재 비번 검증 (BCrypt는 평문 vs 해시 비교 → matches 사용)
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new CustomException(MemberErrorCode.WRONG_CURRENT_PASSWORD);
        }

        // 4) 새 비번이 기존과 동일한지 검증
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_PASSWORD);
        }

        // 5) 새 비번 암호화 후 저장 (의미 메서드 활용)
        String encoded = passwordEncoder.encode(request.getNewPassword());
        user.changePassword(encoded);

        log.info("일반회원 비밀번호 변경 완료: memberNo={}", memberNo);
    }
}
