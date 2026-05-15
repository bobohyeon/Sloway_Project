package com.sloway.app.recent.search.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "RECENT_SEARCH")
@Entity
public class RecentSearchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column
    private Long memberNo;

    @Column(length = 200, name = "keyword")
    private String keyword;

    @Column(name = "search_at")
    private LocalDateTime searchedAt;

    @PrePersist
    public void prePersist(){
        this.searchedAt = LocalDateTime.now();
    }
}
