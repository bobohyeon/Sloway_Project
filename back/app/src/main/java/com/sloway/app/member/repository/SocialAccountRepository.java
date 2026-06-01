package com.sloway.app.member.repository;

import com.sloway.app.member.common.SocialProvider;
import com.sloway.app.member.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {

    /** 제공자 + 소셜 고유 ID로 연동 정보 조회 (로그인 시 "이미 가입했나?" 판별) */
    Optional<SocialAccount> findByProviderAndProviderUserId(
            SocialProvider provider, String providerUserId);
    // 기존 findByProviderAndProviderUserId 아래에 추가
    List<SocialAccount> findByMemberNo(Long memberNo);
}