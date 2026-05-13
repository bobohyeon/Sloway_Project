package com.sloway.app.payment.service;

import com.sloway.app.payment.dto.request.PaymentCreateReqDto;
import com.sloway.app.payment.dto.response.PaymentResDto;
import com.sloway.app.payment.entity.PaymentEntity;
import com.sloway.app.payment.repository.PaymentRepository;
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
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public PaymentResDto pay(PaymentCreateReqDto reqDto) {
        PaymentEntity entity = reqDto.toEntity();
        String fakeTid = createFakeTid();
        entity.completeAsLevel1(fakeTid);
        return PaymentResDto.from(paymentRepository.save(entity));
    }

    public List<PaymentResDto> findPaymentAll() {
        return paymentRepository.findAll().stream().map(PaymentResDto::from).toList();
    }

    public PaymentResDto findPaymentById(Long id) {
        PaymentEntity entity = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id " + id));
        return PaymentResDto.from(entity);
    }

    private String createFakeTid(){
        return "FAKE_" + UUID.randomUUID().toString().substring(0, 12);
    }

}
