package com.sloway.app.notice.entity;

import com.sloway.app.admin.entity.AdminEntity;
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

    @Column(nullable = false)
    private String title;

    @Column(nullable = false , columnDefinition = "TEXT")
    private String content;

    @JoinColumn(name = "ADMIN_NO" , nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private AdminEntity writer;

    public void update(String title , String content){
        this.title = title;
        this.content = content;
    }
}
