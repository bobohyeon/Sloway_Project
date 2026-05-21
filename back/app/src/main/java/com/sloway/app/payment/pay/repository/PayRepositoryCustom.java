package com.sloway.app.payment.pay.repository;

import com.sloway.app.payment.pay.entity.PayEntity;

import java.util.List;

public interface PayRepositoryCustom {
    List<PayEntity> findByMember(Long memberNo);
}
