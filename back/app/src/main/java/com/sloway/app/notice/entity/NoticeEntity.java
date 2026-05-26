package com.sloway.app.notice.entity;

import com.sloway.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "NOTICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class NoticeEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NoticeCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private NoticeStatus status = NoticeStatus.ACTIVE;

    @Column(nullable = false)
    @Builder.Default
    private Long viewCount = 0L;


    public void update(String title, String content, NoticeCategory category, NoticeStatus status) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.status = status;
    }
    
    public void increaseViewCount() {
        this.viewCount++;
    }
}