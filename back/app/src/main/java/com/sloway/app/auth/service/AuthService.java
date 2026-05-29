package com.sloway.app.auth.service;

import com.sloway.app.auth.dto.request.JoinRequestDto;
import com.sloway.app.auth.dto.response.EmailCheckResponseDto;
import com.sloway.app.member.common.AuthType;
import com.sloway.app.member.common.MemberStatus;
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

    @Transactional
    public void userJoin(JoinRequestDto request) {
        // 1) 입력값 검증
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("이메일을 입력하세요");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호룰을 입력하세요");
        }
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
        userRepository.save(user);

        log.info("회원가입 완료 : {} (memberNo = {})", saveMember.getEmail(), saveMember.getNo());

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
    public EmailCheckResponseDto checkEmail(String email){

        boolean isExists = memberRepository.existsByEmail(email);

        return isExists
                ? EmailCheckResponseDto.unavailable()
                :EmailCheckResponseDto.available();
    }

}//class
