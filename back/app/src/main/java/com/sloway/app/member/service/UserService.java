package com.sloway.app.member.service;

import com.sloway.app.auth.dto.request.ChangePasswordRequestDto;
import com.sloway.app.auth.service.EmailService;
import com.sloway.app.aws.service.S3Service;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.dto.request.ChangeEmailRequestDto;
import com.sloway.app.member.dto.request.UpdateUserRequestDto;
import com.sloway.app.member.dto.response.SocialAccountResponseDto;
import com.sloway.app.member.dto.response.UserResponseDto;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.member.repository.SocialAccountRepository;
import com.sloway.app.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    private final EmailService emailService;
    private final SocialAccountRepository socialAccountRepository;// ← 추가
    private final S3Service s3Service;


    public UserResponseDto getMyInfo(Long memberNo) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(
                        () -> new IllegalArgumentException("회원을 찾을 수 없습니다")
                );

        return UserResponseDto.from(member);
    }

    @Transactional
    public UserResponseDto update(Long memberNo, UpdateUserRequestDto request, MultipartFile profileImage) {
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

        // 프로필 이미지가 들어왔을 때만 S3 업로드 + URL 교체
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String imgUrl = s3Service.upload(profileImage, "member-profile");
                member.updateImgUrl(imgUrl);   // 의미 메서드 (없으면 추가)
            } catch (IOException e) {
                throw new CustomException(/* 적절한 에러코드, 예: FILE_UPLOAD_FAILED */);
            }
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
    public void changePassword(Long memberNo, ChangePasswordRequestDto request) {

        // 1) 새 비번 길이 검증
        if (request.getNewPassword() == null || request.getNewPassword().length() < 4) {
            throw new CustomException(MemberErrorCode.PASSWORD_TOO_SHORT);
        }

        // 2) UserEntity 조회 (비번 보유)
        UserEntity user = userRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        // ★ 이메일 인증 확인 — 본인 이메일이 인증 완료 상태여야 변경 가능
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        if (!emailService.isVerified(member.getEmail())) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 3) 현재 비번 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new CustomException(MemberErrorCode.WRONG_CURRENT_PASSWORD);
        }

        // 4) 새 비번이 기존과 동일한지 검증
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_PASSWORD);
        }

        // 5) 새 비번 암호화 후 저장
        String encoded = passwordEncoder.encode(request.getNewPassword());
        user.changePassword(encoded);
        log.info("일반회원 비밀번호 변경 완료: memberNo={}", memberNo);
    }

    /**
     * 일반회원 이메일 변경.
     *
     * <p>새 이메일은 (1) 인증 완료(isVerified) (2) 미사용(중복 아님) 두 조건을 만족해야 함.
     * 프론트에서 인증을 거쳤더라도 서버에서 반드시 재검증 (우회 방지).
     * <p>이메일은 JWT에 박혀있으므로, 변경 후 프론트는 재로그인을 유도해야 함.
     */
    @Transactional
    public void changeEmail(Long memberNo, ChangeEmailRequestDto request) {
        String newEmail = request.getNewEmail();

        // 1) 입력 검증
        if (newEmail == null || newEmail.isBlank()) {
            throw new IllegalArgumentException("새 이메일을 입력하세요");
        }

        // 2) 회원 조회
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 3) 기존 이메일과 동일하면 변경 의미 없음
        if (newEmail.equals(member.getEmail())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_EMAIL);
        }

        // 4) 중복 체크 — 남이 쓰는 이메일이면 거부
        if (memberRepository.existsByEmail(newEmail)) {
            throw new CustomException(MemberErrorCode.EMAIL_DUPLICATED);
        }

        // 5) 인증 완료 여부 재검증 (프론트 우회 방지)
        if (!emailService.isVerified(newEmail)) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 6) 변경
        member.changeEmail(newEmail);
        log.info("일반회원 이메일 변경 완료: memberNo={}", memberNo);
    }
    /**
     * 회원의 연동 소셜 계정 목록 조회.
     */
    @Transactional(readOnly = true)
    public List<SocialAccountResponseDto> getSocialAccounts(Long memberNo) {
        return socialAccountRepository.findByMemberNo(memberNo).stream()
                .map(SocialAccountResponseDto::from)
                .toList();
    }
}//class
