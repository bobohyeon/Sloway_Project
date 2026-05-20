package com.sloway.app.host.service;

import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.dto.request.HostJoinRequestDto;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * 호스트 신청.
     *
     * @param request 회원 공통 정보 + 사업자 정보
     */
    @Transactional
    public void join(HostJoinRequestDto request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("이메일은 필수입니다");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다");
        }
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
        if (request.getBusinessDocUrl() == null || request.getBusinessDocUrl().isBlank()) {
            throw new IllegalArgumentException("사업자등록증 파일은 필수입니다");
        }

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다");
        }

        // 3) 사업자번호 중복 체크 (호스트 특유)
        if (hostRepository.existsByBusinessNo(request.getBusinessNo())) {
            throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 5) Member(공통) 저장 → memberNo 발급
        MemberEntity member = MemberEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .status(MemberStatus.A)
                .build();
        MemberEntity savedMember = memberRepository.save(member);

        // 6) Host(호스트 전용) 저장 — 승인 대기 상태로
        HostEntity host = HostEntity.builder()
                .memberNo(savedMember.getNo())
                .password(encodedPassword)
                .businessName(request.getBusinessName())
                .businessNo(request.getBusinessNo())
                .businessDocUrl(request.getBusinessDocUrl())
                .approvalState(ApprovalState.P)
                .build();
        hostRepository.save(host);

        log.info("호스트 신청 접수: {} (memberNo={}, businessNo={}, approvalState=P)",
                savedMember.getEmail(), savedMember.getNo(), request.getBusinessNo());
    }
}