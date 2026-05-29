package com.sloway.app.host.service;

import com.sloway.app.auth.dto.request.ChangePasswordRequestDto;
import com.sloway.app.auth.service.EmailService;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.dto.request.UpdateHostRequestDto;
import com.sloway.app.host.dto.response.HostMyPageResponseDto;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.dto.request.ChangeEmailRequestDto;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 호스트 — 본인 영역 서비스.
 *
 * <p>호스트가 자기 정보를 조회/수정/탈퇴할 때 사용.
 * 어드민 시점의 호스트 관리는 AdminHostService에서 별도 처리.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HostService {

    private final MemberRepository memberRepository;
    private final HostRepository hostRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public HostMyPageResponseDto hostMyInfo(Long memberNo) {
        // 1) 회원 조회 (없으면 404)
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        // 2) 호스트 조회 — memberNo가 외래키
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 3) DTO 변환
        return HostMyPageResponseDto.from(member, host);

    }

    //호스트 마이페이지 수정 null 필드는 기존 값 유지.
    @Transactional
    public HostMyPageResponseDto update(Long memberNo, UpdateHostRequestDto request) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        // 3) 회원 공통 정보 변경 (UserService.update와 동일 패턴)
        if (request.getName() != null && !request.getName().isBlank()) {
            member.changeName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            member.changePhone(request.getPhone());
        }
        if (request.getImgUrl() != null) {
            // 빈 문자열 허용 (프로필 이미지 제거)
            member.changeImgUrl(request.getImgUrl());
        }

        // 4) 사업자 정보 변경 (호스트 전용)
        if (request.getBusinessName() != null && !request.getBusinessName().isBlank()) {
            host.changeBusinessName(request.getBusinessName());
        }
        log.info("호스트 마이페이지 수정 완료: memberNo={}", memberNo);

        // 5) 수정된 정보를 응답 DTO로 변환 (조회 DTO 재활용)
        return HostMyPageResponseDto.from(member, host);

    }

    /**
     * 호스트 비밀번호 변경.
     *
     * <p>비밀번호는 HostEntity에 BCrypt 해시로 저장.
     */
    @Transactional
    public void changePassword(Long memberNo, ChangePasswordRequestDto request) {

        // 1) 새 비번 길이 검증
        if (request.getNewPassword() == null || request.getNewPassword().length() < 4) {
            throw new CustomException(MemberErrorCode.PASSWORD_TOO_SHORT);
        }

        // 2) 호스트 조회 (비번은 HostEntity에 있음)
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 3) 현재 비번 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), host.getPassword())) {
            throw new CustomException(MemberErrorCode.WRONG_CURRENT_PASSWORD);
        }

        // 4) 새 비번이 기존과 동일한지 검증
        if (passwordEncoder.matches(request.getNewPassword(), host.getPassword())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_PASSWORD);
        }

        // 5) 새 비번 암호화 후 저장
        String encoded = passwordEncoder.encode(request.getNewPassword());
        host.changePassword(encoded);

        log.info("호스트 비밀번호 변경 완료: memberNo={}", memberNo);
    }

    /**
     * 호스트 이메일 변경.
     *
     * <p>이메일은 공통 MemberEntity에 저장되므로 일반회원과 동일 로직.
     * 새 이메일은 (1) 인증 완료 (2) 미사용 조건을 서버에서 재검증.
     * <p>변경 후 프론트는 재로그인 유도 (JWT email claim이 옛 값).
     */
    @Transactional
    public void changeEmail(Long memberNo, ChangeEmailRequestDto request) {
        String newEmail = request.getNewEmail();

        if (newEmail == null || newEmail.isBlank()) {
            throw new IllegalArgumentException("새 이메일을 입력하세요");
        }

        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        if (newEmail.equals(member.getEmail())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_EMAIL);
        }
        if (memberRepository.existsByEmail(newEmail)) {
            throw new CustomException(MemberErrorCode.EMAIL_DUPLICATED);
        }
        if (!emailService.isVerified(newEmail)) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        member.changeEmail(newEmail);
        log.info("호스트 이메일 변경 완료: memberNo={}", memberNo);
    }
}
