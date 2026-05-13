package com.sloway.app.settlement.service;

import com.sloway.app.settlement.dto.request.FeeCreateReqDto;
import com.sloway.app.settlement.dto.response.FeeResDto;
import com.sloway.app.settlement.entity.FeeEntity;
import com.sloway.app.settlement.repository.FeeRepository;
import jakarta.persistence.EntityNotFoundException;
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
    public void save(FeeCreateReqDto reqDto) {
        FeeEntity entity = reqDto.toEntity();
        feeRepository.save(entity);
    }

    public List<FeeResDto> findAll() {
        List<FeeEntity> list = feeRepository.findAll();
        return list.stream().map(FeeResDto::from).toList();
    }

    public FeeResDto findFeeById(Long id) {
        FeeEntity entity = feeRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Fee not found with id " + id)
        );
        return FeeResDto.from(entity);
    }
}
