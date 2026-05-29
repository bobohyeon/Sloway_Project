package com.sloway.app.payment.point.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointErrorCode;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.dto.request.PointSaveReqDto;
import com.sloway.app.payment.point.dto.request.PointUseReqDto;
import com.sloway.app.payment.point.dto.response.PointBalanceResDto;
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
import java.util.stream.Stream;

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
                .orElseThrow(() -> new CustomException(PointErrorCode.POINT_NOT_FOUND));
        return PointResDto.from(pointEntity);
    }

    @Transactional
    public PointResDto savePoint(PointSaveReqDto pointSaveReqDto) {
        PayEntity payEntity = payRepository.findById(pointSaveReqDto.getPayNo())
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        MemberEntity memberEntity = memberRepository.findById(pointSaveReqDto.getMemberNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));
        int amount = (int) (payEntity.getFinalAmt() * 0.01);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);
        PointEntity entity = pointSaveReqDto.toEntity(payEntity, memberEntity);
        entity.applySaveAmount(amount, expiredAt);
        return PointResDto.from(pointRepository.save(entity));
    }

    @Transactional
    public PointResDto usePoint(PointUseReqDto pointSaveReqDto) {

        PayEntity payEntity = payRepository.findById(pointSaveReqDto.getPayNo())
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        MemberEntity memberEntity = memberRepository.findById(pointSaveReqDto.getMemberNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));
        if (pointSaveReqDto.getAmount() < 1000) {
            throw new CustomException(PointErrorCode.POINT_BELOW_MIN);
        }
        if (pointSaveReqDto.getAmount() > payEntity.getFinalAmt() * 30 / 100) {
            throw new CustomException(PointErrorCode.POINT_EXCEED_LIMIT);
        }
        PointEntity entity = pointSaveReqDto.toEntity(payEntity, memberEntity);
        entity.applyUseAmount(-pointSaveReqDto.getAmount());
        return PointResDto.from(pointRepository.save(entity));
    }

    @Transactional
    public PointResDto expirePoint(Long no) {
        PointEntity pointEntity = pointRepository.findById(no)
                .orElseThrow(() -> new CustomException(PointErrorCode.POINT_NOT_FOUND));
        pointEntity.expire();
        return PointResDto.from(pointEntity);
    }

    @Transactional
    public PointResDto confirmEarnPoint(Long no) {
        PointEntity pointEntity = pointRepository.findById(no)
                .orElseThrow(() -> new CustomException(PointErrorCode.POINT_NOT_FOUND));
        pointEntity.confirmEarn();
        return PointResDto.from(pointEntity);
    }


    @Transactional
    public void usePointInternal(Long memberNo, Integer amount, PayEntity payEntity) {
        if (amount < 1000) {
            throw new CustomException(PointErrorCode.POINT_BELOW_MIN);
        }
        int dcAmtSafe = payEntity.getDcAmt() == null ? 0 : payEntity.getDcAmt();
        int basisAmt = payEntity.getBaseAmt() + payEntity.getAddAmt() - dcAmtSafe;
        int pointLimit = (basisAmt * 30) / 100;
        if (amount > pointLimit) {
            throw new CustomException(PointErrorCode.POINT_EXCEED_LIMIT);
        }
        MemberEntity memberEntity = memberRepository.findById(memberNo)
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));
        Integer currentPoint = pointRepository.sumByMemberAndStatus(memberNo, PointStatus.SAVE);
        if (currentPoint < amount) {
            throw new CustomException(PointErrorCode.POINT_INSUFFICIENT);
        }
        PointEntity entity = PointEntity.builder()
                .memberNo(memberEntity)
                .payNo(payEntity)
                .amount(-amount)
                .dealType(PointDealType.USE)
                .status(PointStatus.USED)
                .expiredAt(null)
                .build();
        pointRepository.save(entity);
    }


    @Transactional
    public void earnPointInternal(Long memberNo, PayEntity payEntity) {
        int savePoint = (int) (payEntity.getFinalAmt() * 0.01);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);
        MemberEntity memberEntity = memberRepository.findById(memberNo)
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));

        PointEntity pointEntity = PointEntity.builder()
                .memberNo(memberEntity)
                .payNo(payEntity)
                .amount(savePoint)
                .dealType(PointDealType.EARN)
                .expiredAt(expiredAt)
                .status(PointStatus.WAIT)
                .build();
        pointRepository.save(pointEntity);
    }

    public PointBalanceResDto findPointBalanceByMemberNo(Long memberNo) {
        MemberEntity memberEntity = memberRepository.findById(memberNo)
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));
        Integer balance = pointRepository.sumByMemberAndStatus(memberNo, PointStatus.SAVE);
        return PointBalanceResDto.from(memberEntity, balance);
    }

    @Transactional
    public void refundUsedPoint(PayEntity payEntity) {

        MemberEntity member = memberRepository.findById(payEntity.getRsvnNo().getMemberNo().getNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));

        List<PointEntity> pointList = pointRepository.findByPayAndDealType(payEntity.getNo(), PointDealType.USE);
        int sumPoint = pointList.stream().mapToInt(PointEntity::getAmount).sum();
        int returnPoint = Math.abs(sumPoint);
        if (returnPoint == 0) return;
        PointEntity entity = PointEntity.builder()
                .memberNo(member)
                .payNo(payEntity)
                .amount(returnPoint)
                .dealType(PointDealType.EARN)
                .status(PointStatus.SAVE)
                .expiredAt(LocalDateTime.now().plusYears(1))
                .build();
        pointRepository.save(entity);
    }

    @Transactional
    public void cancelEarnedPoint(PayEntity payEntity) {
        List<PointEntity> pointList = pointRepository.findByPayAndDealType(payEntity.getNo(), PointDealType.EARN);
        pointList.stream()
                .filter(p -> p.getStatus() == PointStatus.WAIT || p.getStatus() == PointStatus.SAVE)
                .forEach(PointEntity::cancel);
    }



}
