package com.sloway.app.common.init;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.admin.repository.AdminRepository;
import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.AuthType;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 데모 계정 자동 생성기.
 *
 * <p>서버 기동 시 데모 계정 3개(user/host/admin)를 자동 INSERT.
 * 다른 도메인 담당자들이 로그인 토큰을 즉시 받아 API를 테스트할 수 있게 함.
 *
 * <p>이미 존재하면 건너뜀 (서버 재시작마다 중복 생성 방지).
 * ddl-auto=create 라 어차피 매번 테이블이 새로 생기지만,
 * 방어적으로 존재 체크 (운영 전환 시 안전).
 *
 * <h3>데모 계정</h3>
 * <pre>
 *   user@demo.com  / 1234  (일반회원)
 *   host@demo.com  / 1234  (호스트, 승인완료 상태)
 *   admin@demo.com / 1234  (관리자)
 * </pre>
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDataLoader implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final HostRepository hostRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) throws Exception {
        createDemoUser();
        createDemoHost();
        createDemoAdmin();
        log.info("데모 계정 준비 완료 (user/host/admin  / 1234)");
    }

    private void createDemoUser() {
        String email = "user@demo.com";

        if (memberRepository.existsByEmail(email)) {
            return;
        }
        // 1) Member (공통 정보) 먼저 저장 → memberNo 발급받음
        MemberEntity member = MemberEntity.builder()
                .email(email)
                .name("일반유저")
                .phone("01012345678")
                .birthDate("19981030")
                .status(MemberStatus.A)
                .build();
        MemberEntity saveMember = memberRepository.save(member);

        // 2) User (일반회원 전용) — Member의 no를 FK로 연결
        UserEntity user = UserEntity.builder()
                .memberNo(saveMember.getNo())
                .password(passwordEncoder.encode("1234"))
                .authType(AuthType.L)
                .build();
        userRepository.save(user);
        log.info("테스트 일반유저 생성 : {} (memberNo = {})", email, saveMember.getNo());

    }

    /**
     * 호스트 데모 계정 생성.
     *
     * <p>Member(공통) + Host(호스트 전용) 2개 테이블에 INSERT.
     * 데모용이라 approvalState=A(승인완료)로 바로 생성 — 시연 시
     * 호스트 기능을 즉시 쓸 수 있게 (실제로는 관리자 승인 거쳐야 A).
     */
    private void createDemoHost() {
        String email = "host@demo.com";

        if (memberRepository.existsByEmail(email)) {
            return;
        }
        // 1) Member (공통 정보) 먼저 저장 → memberNo 발급받음
        MemberEntity member = MemberEntity.builder()
                .email(email)
                .name("호스트유저")
                .phone("01011111111")
                .birthDate("19981030")
                .status(MemberStatus.A)
                .build();
        MemberEntity saveMember = memberRepository.save(member);


        // 2) Host 전용 — 별도 비번 + 사업자정보 + 승인상태
        HostEntity host = HostEntity.builder()
                .memberNo(saveMember.getNo())
                .password(passwordEncoder.encode("1234"))
                .businessName("워크 엔 스테이")
                .businessNo("1234567890")
                //데모여서 즉시 승인
                .approvalState(ApprovalState.A)
                .approvedAt(LocalDateTime.now())
                .build();
        hostRepository.save(host);
        log.info("데모 호스트 생성: {} (memberNo={}, 승인완료)", email, saveMember.getNo());
    }

    // 관리자 데모 계정 생성
    private void createDemoAdmin() {
        String email = "admin@demo.com";

        if (adminRepository.existsByEmail(email)){
            return;
        }
        AdminEntity admin = AdminEntity.builder()
                .email(email)
                .password(passwordEncoder.encode("1234"))
                .name("SloWay관리자")
                .phone("01022222222")
                .build();
        adminRepository.save(admin);
        log.info("데모 관리자 생성: {}", email);
    }


}//class
