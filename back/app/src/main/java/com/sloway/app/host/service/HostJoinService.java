package com.sloway.app.host.service;

import com.sloway.app.auth.service.EmailService;
import com.sloway.app.aws.service.S3Service;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.common.util.PasswordValidator;
import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.dto.request.HostJoinRequestDto;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 호스트 신청 서비스.
 *
 * <p>호스트는 일반회원과 달리 신청 → 어드민 승인 → 활성화 2단계 흐름.
 * 신청 시점에는 approvalState=P (Pending, 승인 대기) 로 저장된다.
 *
 * <h3>로그인 정책 (참고)</h3>
 * 미승인 호스트도 로그인은 허용. 기능 제한은 각 호스트 API에서
 * approvalState 체크 (이 정책은 의도된 것 — HostDetailService 주석 참조).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HostJoinService {

    private final MemberRepository memberRepository;
    private final HostRepository hostRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final S3Service s3Service;

    /**
     * 호스트 신청 (사업자등록증 PDF 업로드 포함).
     *
     * @param request     회원 공통 정보 + 사업자 정보
     * @param businessDoc 사업자등록증 파일 (PDF)
     */
    @Transactional
    public void join(HostJoinRequestDto request, MultipartFile businessDoc) {

        // 1) 기본 검증
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("이메일은 필수입니다");
        }
        //비밀번호
        PasswordValidator.validate(request.getPassword());

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("이름은 필수입니다");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("전화번호는 필수입니다");
        }
        if (request.getBusinessName() == null || request.getBusinessName().isBlank()) {
            throw new IllegalArgumentException("상호명은 필수입니다");
        }
        if (request.getBusinessNo() == null || request.getBusinessNo().isBlank()) {
            throw new IllegalArgumentException("사업자등록번호는 필수입니다");
        }
        // 파일 검증 (URL 문자열 검증 → 파일 존재 검증으로 변경)
        if (businessDoc == null || businessDoc.isEmpty()) {
            throw new IllegalArgumentException("사업자등록증 파일은 필수입니다");
        }

        // 2) 이메일 중복 체크
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다");
        }
        // 3) 이메일 인증 여부
        if (!emailService.isVerified(request.getEmail())) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }
        // 4) 사업자번호 중복 체크
        if (hostRepository.existsByBusinessNo(request.getBusinessNo())) {
            throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다");
        }

        // 5) 모든 검증 통과 후 파일 업로드 (실패 시 S3 쓰레기 방지)
        String businessDocUrl;
        try {
            businessDocUrl = s3Service.upload(businessDoc, "host-business-doc");
        } catch (IOException e) {
            log.error("사업자등록증 업로드 실패: email={}", request.getEmail(), e);
            throw new IllegalArgumentException("사업자등록증 업로드에 실패했습니다");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 6) Member 저장
        MemberEntity member = MemberEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .status(MemberStatus.A)
                .build();
        MemberEntity savedMember = memberRepository.save(member);

        // 7) Host 저장 (업로드된 파일 key를 businessDocUrl로)
        HostEntity host = HostEntity.builder()
                .memberNo(savedMember.getNo())
                .password(encodedPassword)
                .businessName(request.getBusinessName())
                .businessNo(request.getBusinessNo())
                .businessDocUrl(businessDocUrl)
                .approvalState(ApprovalState.P)
                .build();
        hostRepository.save(host);

        log.info("호스트 신청 접수: {} (memberNo={}, businessNo={}, approvalState=P)",
                savedMember.getEmail(), savedMember.getNo(), request.getBusinessNo());
    }
}