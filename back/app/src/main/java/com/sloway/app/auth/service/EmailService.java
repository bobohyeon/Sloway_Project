package com.sloway.app.auth.service;

import com.sloway.app.auth.entity.EmailVerification;
import com.sloway.app.auth.repository.EmailVerificationRepository;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 이메일 인증 서비스.
 *
 * <p>가입 화면에서 사용. 3단계 흐름:
 * <ol>
 *   <li>sendCode(email)    — 6자리 코드 생성, DB 저장, 메일 발송</li>
 *   <li>verifyCode(email, code) — 코드 검증 후 verified=true 마킹</li>
 *   <li>isVerified(email)  — 가입 시점 호출, 인증된 이메일인지 확인</li>
 * </ol>
 *
 * <p>EmailVerification 테이블 1행 = 1회 발송. 같은 이메일에 여러 발송 가능,
 * 검증은 항상 최신 행 기준.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailService {

    // ─── 의존성 ────────────────────────────────
    private final EmailVerificationRepository emailVerificationRepository;
    private final JavaMailSender mailSender;   // Spring Boot Starter Mail이 자동 빈 등록

    // ─── 설정값 (application-secret.properties에서 주입) ───
    @Value("${spring.mail.username}")
    private String fromEmail;                  // 보내는 사람 (Gmail 주소)

    // ─── 상수 ───────────────────────────────────
    private static final long CODE_EXPIRE_MINUTES = 5;   // 5분 만료
    private static final int CODE_LENGTH = 6;             // 6자리

    /**
     * 이메일 인증번호 발송.
     *
     * <p>호출 시점: 가입 화면에서 [인증번호 발송] 버튼 클릭.
     * <p>처리 흐름:
     * <ol>
     *   <li>6자리 랜덤 코드 생성</li>
     *   <li>EmailVerification 엔티티 INSERT (만료시각 = 지금 + 5분)</li>
     *   <li>Gmail SMTP로 메일 발송</li>
     * </ol>
     *
     * <p>같은 이메일에 여러 번 발송 가능 — 매번 새 행 INSERT. 검증 시 최신 행 사용.
     *
     * @param email 인증번호 받을 이메일
     */
    @Transactional
    public void sendCode(String email) {

        // 1) 6자리 랜덤 숫자 코드 생성 (000000 ~ 999999)
        //    String.format으로 앞자리 0 채움 → 항상 6자리 보장
        String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));

        // 2) 만료 시각 계산: 지금 + 5분
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(CODE_EXPIRE_MINUTES);

        // 3) EmailVerification 엔티티 생성 + 저장 (verified는 기본 false)
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiredAt(expiredAt)
                .verified(false)
                .build();
        emailVerificationRepository.save(verification);

        // 4) 메일 발송 (SMTP)
        sendMail(email, code);

        log.info("이메일 인증번호 발송: email={}, expiredAt={}", email, expiredAt);
    }


    /**
     * 메일 발송
     */
    private void sendMail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("[Sloway] 이메일 인증번호 안내");
        message.setText(
                "안녕하세요, Sloway입니다.\n\n"
                        + "아래 인증번호를 가입 화면에 입력해주세요.\n\n"
                        + "인증번호: " + code + "\n\n"
                        + "본 인증번호는 발급 후 " + CODE_EXPIRE_MINUTES + "분간 유효합니다.\n"
                        + "본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다."
        );
        mailSender.send(message);
    }

    /**
     * 이메일 인증번호 확인.
     *
     * <p>호출 시점: 가입 화면에서 [인증] 버튼 클릭.
     * <p>검증 통과 시 EmailVerification.verified = true 마킹.
     * <p>이후 가입 API에서 이 마킹 확인하고 가입 허용.
     *
     */
    @Transactional
    public void verifyCode(String email, String code) {

        // 1) 같은 이메일 + 같은 코드인 최신 행 조회 (없으면 400)
        EmailVerification verification = emailVerificationRepository
                .findFirstByEmailAndCodeOrderByNoDesc(email, code)
                .orElseThrow(() -> new CustomException(MemberErrorCode.INVALID_VERIFY_CODE));

        // 2) 이미 인증된 코드 재사용 방지
        if (verification.isVerified()) {
            throw new CustomException(MemberErrorCode.ALREADY_VERIFIED);
        }

        // 3) 만료 검사 (Entity의 isExpired() 의미 메서드 활용)
        if (verification.isExpired()) {
            throw new CustomException(MemberErrorCode.EXPIRED_VERIFY_CODE);
        }

        // 4) 인증 완료 마킹 (의미 메서드)
        verification.verify();

        log.info("이메일 인증 완료: email={}", email);
    }

    /**
     * 가입 시점 인증 여부 검증.
     *
     * <p>가입 API(AuthService.userJoin, HostJoinService.join)에서 호출.
     * <p>해당 이메일에 verified=true인 최신 행이 있으면 true.
     *
     */
    public boolean isVerified(String email) {
        return emailVerificationRepository
                .findFirstByEmailAndVerifiedTrueOrderByNoDesc(email)
                .isPresent();
    }


}//class