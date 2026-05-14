package com.sloway.app.payment.pay.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
public abstract class PayBaseEntity {

    @Column(length = 1, nullable = false)
    protected String delYn;

    @Column(nullable = false, updatable = false)
    protected LocalDateTime createdAt;

    protected LocalDateTime modifiedAt;

    @PrePersist
    public void prePersist() {
        this.delYn = "N";
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.modifiedAt = LocalDateTime.now();
    }

    public void delete() {
        this.delYn = "Y";
    }
}
