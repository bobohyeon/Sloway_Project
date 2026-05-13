package com.sloway.app.payment.service;

import com.sloway.app.payment.dto.request.PaymentCreateReqDto;
import com.sloway.app.payment.dto.response.PaymentResDto;
import com.sloway.app.payment.entity.PaymentEntity;
import com.sloway.app.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        String fakeTid = "FAKE_" + UUID.randomUUID().toString().substring(0, 12);
        entity.completeAsLevel1(fakeTid);
        return PaymentResDto.from(paymentRepository.save(entity));
    }


    // TODO: 2) 결제 목록 조회 — public List<PaymentResDto> findAll()
    //       힌트: FeeService.findAll() 패턴 그대로
    //         - paymentRepository.findAll()
    //         - stream().map(PaymentResDto::from).toList()


    // TODO: 3) 결제 단건 조회 — public PaymentResDto findPaymentById(Long id)
    //       힌트: FeeService.findFeeById() 패턴 그대로
    //         - paymentRepository.findById(id)
    //         - .orElseThrow(() -> new EntityNotFoundException("Payment not found with id " + id))
    //         - PaymentResDto.from(entity) 반환


    // TODO: 4) (선택) private String generateFakeTid()
    //       힌트:
    //         return "FAKE_" + UUID.randomUUID().toString().substring(0, 12);
    //       → pay() 메서드 안에 인라인으로 써도 되지만 메서드로 빼는 게 가독성·테스트 용이성↑
}
