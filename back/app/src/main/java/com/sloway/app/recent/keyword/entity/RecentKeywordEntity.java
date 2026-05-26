package com.sloway.app.recent.keyword.entity;

import com.sloway.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "RECENT_SEARCH")
@Entity
public class RecentKeywordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "user_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @Column(length = 200, name = "keyword")
    private String keyword;

    @Column(name = "searched_at")
    private LocalDateTime searchedAt;

    @PrePersist
    public void prePersist(){
        this.searchedAt = LocalDateTime.now();
    }
}
