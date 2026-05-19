package com.sloway.app.payment.point.service;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.dto.request.PointSaveReqDto;
import com.sloway.app.payment.point.dto.request.PointUseReqDto;
import com.sloway.app.payment.point.dto.response.PointResDto;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.repository.PointRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PointService {

    private final PointRepository pointRepository;
    private final PayRepository payRepository;
    private final MemberRepository memberRepository;

    public List<PointResDto> findPointAll() {
        return pointRepository.findAll().stream().map(PointResDto::from).toList();
    }

    public PointResDto findPointByNo(Long no) {
        PointEntity pointEntity = pointRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("포인트 정보를 조회할 수 없습니다."));

        return PointResDto.from(pointEntity);
    }

    @Transactional
    public PointResDto savePoint(PointSaveReqDto reqDto) {
        PayEntity payEntity = payRepository.findById(reqDto.getPayNo())
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 조회할 수 없습니다."));

        MemberEntity memberEntity = memberRepository.findById(reqDto.getMemberNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));

        int amount = (int) (payEntity.getFinalAmt() * 0.01);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);

        PointEntity entity = reqDto.toEntity(payEntity, memberEntity);
        entity.applySaveAmount(amount, expiredAt);

        return PointResDto.from(pointRepository.save(entity));
    }

    @Transactional
    public PointResDto usePoint(PointUseReqDto reqDto) {

        PayEntity payEntity = payRepository.findById(reqDto.getPayNo())
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 조회할 수 없습니다."));

        MemberEntity memberEntity = memberRepository.findById(reqDto.getMemberNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));

        if (reqDto.getAmount() < 1000) {
            throw new IllegalArgumentException("최소 1000P부터 사용 가능");
        }
        if (reqDto.getAmount() > payEntity.getFinalAmt() * 30 / 100) {
            throw new IllegalArgumentException("결제금액의 30%까지만 사용 가능");
        }

        PointEntity entity = reqDto.toEntity(payEntity, memberEntity);

        entity.applyUseAmount(-reqDto.getAmount());
        return PointResDto.from(pointRepository.save(entity));
    }

    @Transactional
    public PointResDto expirePoint(Long no) {
        PointEntity pointEntity = pointRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("조회할 수 없습니다."));

        pointEntity.expire();
        return PointResDto.from(pointEntity);
    }

    @Transactional
    public PointResDto confirmEarnPoint(Long no) {
        PointEntity pointEntity = pointRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("포인트 정보를 조회할 수 없습니다."));

        pointEntity.confirmEarn();
        return PointResDto.from(pointEntity);
    }
}
