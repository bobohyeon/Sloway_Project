package com.sloway.app.auth.oauth;

import com.sloway.app.auth.util.JwtUtil;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.AuthType;
import com.sloway.app.member.common.MemberRole;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.common.SocialProvider;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.entity.SocialAccount;
import com.sloway.app.member.entity.UserEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.member.repository.SocialAccountRepository;
import com.sloway.app.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 카카오 OAuth 로그인 처리.
 *
 * <p>흐름: code → 카카오 사용자 정보 → SocialAccount 조회
 * - 이미 연동된 계정: 그 회원으로 로그인
 * - 신규: MemberEntity + UserEntity + SocialAccount 생성 후 로그인
 * 마지막에 우리 JWT(accessToken)를 발급해 반환.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

    private final KakaoOAuthClient kakaoOAuthClient;
    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * 카카오 인가 코드로 로그인 처리 → 우리 accessToken 반환.
     */
    @Transactional
    public String login(String code) {
        // 1) code → 카카오 토큰 → 사용자 정보
        String kakaoToken = kakaoOAuthClient.getAccessToken(code);
        KakaoUserInfo info = kakaoOAuthClient.getUserInfo(kakaoToken);

//        // 2) 이메일 필수 (동의 안 했으면 가입 불가)
//        if (info.getEmail() == null || info.getEmail().isBlank()) {
//            throw new IllegalStateException("카카오 이메일 제공에 동의해야 가입할 수 있습니다");
//        }

        // 3) 이미 연동된 소셜 계정인지 조회
        MemberEntity member = socialAccountRepository
                .findByProviderAndProviderUserId(SocialProvider.K, info.getProviderUserId())
                .map(sa -> memberRepository.findById(sa.getMemberNo())
                        .orElseThrow(() -> new IllegalStateException("연동 회원을 찾을 수 없습니다")))
                .orElseGet(() -> registerNewSocialMember(info)); // 신규 가입

        // 4) 우리 JWT 발급 (일반회원 role = U)
        String accessToken = jwtUtil.createAccessToken(
                member.getNo(),
                member.getEmail(),
                MemberRole.U.name(),
                member.getName()
        );

        log.info("카카오 로그인 성공: memberNo={}, email={}", member.getNo(), member.getEmail());
        return accessToken;
    }

    /**
     * 신규 소셜 회원 등록: Member + User + SocialAccount 생성.
     */
    private MemberEntity registerNewSocialMember(KakaoUserInfo info) {
        // 이메일이 있으면 기존 회원 연동 시도, 없으면 신규 생성
        MemberEntity member;
        if (info.getEmail() != null && !info.getEmail().isBlank()) {
            member = memberRepository.findByEmail(info.getEmail())
                    .orElseGet(() -> createMember(info));
        } else {
            member = createMember(info);
        }

        if (!userRepository.existsByMemberNo(member.getNo())) {
            UserEntity user = UserEntity.builder()
                    .memberNo(member.getNo())
                    .password(null)
                    .authType(AuthType.K)
                    .build();
            userRepository.save(user);
        }

        SocialAccount socialAccount = SocialAccount.builder()
                .memberNo(member.getNo())
                .provider(SocialProvider.K)
                .providerUserId(info.getProviderUserId())
                .build();
        socialAccountRepository.save(socialAccount);

        return member;
    }

    /**
     * MemberEntity 신규 생성 (소셜 정보로)
     */
    private MemberEntity createMember(KakaoUserInfo info) {
        // 카카오가 이메일을 안 주면 임시 이메일 생성 (소셜 고유 id 기반, 유니크 보장)
        String email = (info.getEmail() != null && !info.getEmail().isBlank())
                ? info.getEmail()
                : "kakao_" + info.getProviderUserId() + "@social.sloway";

        MemberEntity member = MemberEntity.builder()
                .email(email)
                .name(info.getNickname() != null ? info.getNickname() : "카카오회원")
                .phone("")
                .status(MemberStatus.A)
                .verifiedAt(java.time.LocalDateTime.now())   // ← 카카오 인증 이메일이므로 인증 완료 처리
                .build();
        return memberRepository.save(member);
    }
}