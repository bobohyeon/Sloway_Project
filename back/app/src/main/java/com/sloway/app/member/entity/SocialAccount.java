package com.sloway.app.member.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.member.common.SocialProvider;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 소셜 계정 연동 정보.
 *
 * <p>한 회원(MemberEntity)이 여러 소셜 계정을 연동할 수 있도록 별도 테이블로 분리.
 * provider + providerUserId 조합으로 "이 소셜 계정이 누구인지" 식별한다.
 */
@Entity
@Table(
        name = "SOCIAL_ACCOUNT",
        uniqueConstraints = {
                // 같은 제공자의 같은 소셜 계정은 한 번만 연동
                @UniqueConstraint(columnNames = {"provider", "providerUserId"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class SocialAccount extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    /** 연동된 회원 (MemberEntity.no 참조) */
    @Column(nullable = false)
    private Long memberNo;

    /** 소셜 제공자 (K=카카오, G=구글) */
    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    private SocialProvider provider;

    /** 제공자가 부여한 고유 사용자 ID (카카오는 숫자 id, 구글은 sub) */
    @Column(length = 100, nullable = false)
    private String providerUserId;
}