package com.sloway.app.auth.service;

import com.sloway.app.auth.dto.request.FindEmailRequestDto;
import com.sloway.app.auth.dto.request.JoinRequestDto;
import com.sloway.app.auth.dto.request.ResetPasswordRequestDto;
import com.sloway.app.auth.dto.response.EmailCheckResponseDto;
import com.sloway.app.auth.dto.response.FindEmailResponseDto;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.common.util.PasswordValidator;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.AuthType;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.common.MemberRole;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.member.repository.UserRepository;
import com.sloway.app.payment.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스 — 일반회원만 회원가입.
 *
 * <p>로그인은 LoginFilter에서 처리하므로 여기엔 없음.
 * 가입은 인증이 아닌 회원 데이터 생성이라 일반 Service로 처리.
 *
 * <p>가입 흐름:
 * <ol>
 *   <li>입력값 검증 (null·공백)</li>
 *   <li>이메일 중복 체크</li>
 *   <li>비밀번호 BCrypt 암호화</li>
 *   <li>Member(공통) 저장 → memberNo 발급</li>
 *   <li>User(일반회원) 저장 — memberNo로 연결</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final HostRepository hostRepository;
    private final PointService pointService;


    @Transactional
    public void userJoin(JoinRequestDto request) {
        // 1) 입력값 검증
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("이메일을 입력하세요");
        }
        //비밀번호 검증
        PasswordValidator.validate(request.getPassword());

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("이름을 입력하세요");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("휴대폰을 입력하세요");
        }
        // 2) 이메일 중복 체크
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일 입니다");
        }
        // 이메일 인증 완료 여부 검증
        if (!emailService.isVerified(request.getEmail())) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }
        // 3) 비밀번호 암호화 (평문 저장 절대 금지)
        String encoded = passwordEncoder.encode(request.getPassword());

        // 4) Member(공통) 저장 → memberNo 발급
        MemberEntity member = MemberEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .status(MemberStatus.A)
                .build();
        MemberEntity saveMember = memberRepository.save(member);

        // 5) User(일반회원 전용) 저장 — Member의 no를 FK로 연결
        UserEntity user = UserEntity.builder()
                .memberNo(saveMember.getNo())
                .password(encoded)
                .authType(AuthType.L)
                .build();
        //가입완료
        userRepository.save(user);
        
        //회원가입 포인트 적립
        pointService.earnSignupPoint(saveMember.getNo());

        log.info("회원가입 완료 : {} (memberNo = {}, 가입포인트 적립)",
                saveMember.getEmail(), saveMember.getNo());
    }

    /**
     * 이메일 중복 확인.
     *
     * <p>가입 화면에서 이메일 입력 시 실시간 중복 체크용.
     * 일반회원/호스트 가입 둘 다 같은 Member 테이블 보기 때문에 메서드 1개로 공통 처리.
     *
     * @param email 확인할 이메일
     * @return 사용 가능 여부 + 메시지
     */
    public EmailCheckResponseDto checkEmail(String email) {

        boolean isExists = memberRepository.existsByEmail(email);

        return isExists
                ? EmailCheckResponseDto.unavailable()
                : EmailCheckResponseDto.available();
    }

    /**
     * 아이디(이메일) 찾기.
     * 이름 + 전화번호로 회원을 조회해 이메일을 마스킹하여 반환.
     *
     * @throws IllegalArgumentException 일치하는 회원이 없을 때
     */
    public FindEmailResponseDto findEmail(FindEmailRequestDto request) {
        // 1) phone 하이픈 제거 (DB는 하이픈 없이 저장)
        String phone = request.getPhone().replaceAll("-", "");

        // 2) 이름 + 전화번호로 회원 조회
        MemberEntity member = memberRepository
                .findByNameAndPhone(request.getName(), phone)
                .orElseThrow(() ->
                        new IllegalArgumentException("일치하는 계정 정보가 없습니다."));

        // 3) 이메일 마스킹 후 반환
        return FindEmailResponseDto.builder()
                .maskedEmail(maskEmail(member.getEmail()))
                .build();
    }

    /**
     * 이메일 마스킹.
     * 로컬파트(@ 앞) 앞 2~3글자만 남기고 나머지를 * 처리.
     * 예: hong@sloway.com → ho**@sloway.com, honggildong@sloway.com → hon********@sloway.com
     */
    private String maskEmail(String email) {
        int at = email.indexOf('@');
        String local = email.substring(0, at);   // @ 앞
        String domain = email.substring(at);      // @ 포함 뒤

        // 앞 2글자(2글자 이하면 1글자)만 노출, 나머지 *
        int visible = local.length() <= 2 ? 1 : 2;
        String masked = local.substring(0, visible)
                + "*".repeat(local.length() - visible);

        return masked + domain;
    }

    /**
     * 비밀번호 찾기(재설정) — 비로그인 상태.
     *
     * <p>이메일 인증(isVerified)으로 본인을 확인한 뒤 새 비번을 저장한다.
     * <p>일반회원/호스트 모두 이메일은 MemberEntity, 비번은 각자 엔티티(User/Host)에 있다.
     * MemberEntity엔 role 컬럼이 없으므로, 연장 테이블(User/Host) 존재 여부로 역할을 판별한다.
     * (로그인 시 role 결정 방식과 동일)
     */
    @Transactional
    public void resetPassword(ResetPasswordRequestDto request) {
        String email = request.getEmail();
        String newPassword = request.getNewPassword();

        // 1) 입력 검증
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("이메일을 입력하세요");
        }
        //비번
        PasswordValidator.validate(newPassword);
        // 2) 인증 완료 여부 재검증 (프론트 우회 방지) — 핵심 보안 게이트
        if (!emailService.isVerified(email)) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 3) 이메일로 회원 조회 (가입된 이메일인지 동시에 확인)
        MemberEntity member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        String encoded = passwordEncoder.encode(newPassword);

        // 4) 연장 테이블로 역할 판별 → 해당 엔티티의 비번 갱신
        Long memberNo = member.getNo();
        MemberRole role;

        if (userRepository.existsByMemberNo(memberNo)) {
            UserEntity user = userRepository.findByMemberNo(memberNo)
                    .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
            user.changePassword(encoded);
            role = MemberRole.U;
        } else if (hostRepository.existsByMemberNo(memberNo)) {
            HostEntity host = hostRepository.findByMemberNo(memberNo)
                    .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
            host.changePassword(encoded);
            role = MemberRole.H;
        } else {
            // User도 Host도 아님 (어드민이거나 데이터 이상) → 재설정 대상 아님
            throw new CustomException(MemberErrorCode.MEMBER_NOT_FOUND);
        }

        log.info("비밀번호 재설정 완료: email={}, role={}", email, role);
    }
}//class
