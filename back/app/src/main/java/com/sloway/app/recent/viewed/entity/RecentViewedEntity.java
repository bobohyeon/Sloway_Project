package com.sloway.app.recent.viewed.entity;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "RECENT_PLACE")
@Entity
public class RecentViewedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "place_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private PlaceEntity placeNo;

    @JoinColumn(name = "user_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @Column(name = "view_at", nullable = false)
    private LocalDateTime viewAt;

    @PrePersist
    public void prePersist(){
        this.viewAt = LocalDateTime.now();
    }
}
