package com.sloway.app.payment.pay.service;

import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PayService {

    private final PayRepository payRepository;

    @Transactional
    public PayResDto createPay(PayCreateReqDto reqDto) {
        PayEntity entity = reqDto.toEntity();
        String fakeTid = createFakeTid();
        entity.completeAsLevel1(fakeTid);
        return PayResDto.from(payRepository.save(entity));
    }

    public List<PayResDto> findPayAll() {
        return payRepository.findAll().stream().map(PayResDto::from).toList();
    }

    public PayResDto findPayByNo(Long no) {
        PayEntity entity = payRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 조회할 수 없습니다."));
        return PayResDto.from(entity);
    }

    private String createFakeTid(){
        return "FAKE_" + UUID.randomUUID().toString().substring(0, 12);
    }

}
