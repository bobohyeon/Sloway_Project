package com.sloway.app.faq.entity;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.faq.enums.FaqCategory;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FAQ")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class FaqEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FaqCategory category;

    @JoinColumn(name = "WRITER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private AdminEntity writer;

    public void update(String title, String content, FaqCategory category) {
        this.title = title;
        this.content = content;
        this.category = category;
    }
}
