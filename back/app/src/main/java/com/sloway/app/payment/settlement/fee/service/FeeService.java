package com.sloway.app.payment.settlement.fee.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.settlement.fee.common.FeeErrorCode;
import com.sloway.app.payment.settlement.fee.dto.request.FeeCreateReqDto;
import com.sloway.app.payment.settlement.fee.dto.response.FeeResDto;
import com.sloway.app.payment.settlement.fee.entity.FeeEntity;
import com.sloway.app.payment.settlement.fee.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class FeeService {

    private final FeeRepository feeRepository;

    @Transactional
    public void createFee(FeeCreateReqDto feeCreateReqDto) {
        FeeEntity entity = feeCreateReqDto.toEntity();
        feeRepository.save(entity);
    }

    public List<FeeResDto> findFeeAll() {
        List<FeeEntity> list = feeRepository.findAll();
        return list.stream().map(FeeResDto::from).toList();
    }

    public FeeResDto findFeeById(Long id) {
        FeeEntity entity = feeRepository.findById(id).orElseThrow(
                () -> new CustomException(FeeErrorCode.FEE_NOT_FOUND));
        return FeeResDto.from(entity);
    }
}
