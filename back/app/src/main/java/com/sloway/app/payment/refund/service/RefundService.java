package com.sloway.app.payment.refund.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.common.RefundErrorCode;
import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.dto.request.RefundCreateReqDto;
import com.sloway.app.payment.refund.dto.response.RefundResDto;
import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class RefundService {

    private final RefundRepository refundRepository;
    private final PayRepository payRepository;
    private final RsvnRepository rsvnRepository;

    @Transactional
    public RefundResDto createRefund(RefundCreateReqDto refundCreateReqDto) {

        PayEntity pay = payRepository.findById(refundCreateReqDto.getPayNo())
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        if (pay.getStatus() != PayStatus.COMPLETED) {
            throw new CustomException(PayErrorCode.PAY_NOT_COMPLETED);
        }

        if (pay.getFinalAmt() == null || pay.getFinalAmt() <= 0) {
            throw new CustomException(RefundErrorCode.REFUND_AMOUNT_INVALID);
        }
        RsvnEntity rsvn = rsvnRepository.findById(refundCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new EntityNotFoundException("예약 정보를 조회할 수 없습니다."));

        RefundEntity entity = refundCreateReqDto.toEntity(pay, rsvn);
        RefundRate rate = refundRate(entity);

        boolean exists = refundRepository.existsByPayAndStatus(
                pay.getNo(),
                List.of(RefundStatus.REQUESTED,
                        RefundStatus.APPROVED,
                        RefundStatus.COMPLETED)
        );

        if (exists) {
            log.warn("중복 환불 시도 : payNo={}", pay.getNo());
            throw new CustomException(RefundErrorCode.REFUND_DUPLICATE);
        }

        if (RefundRate.DDAY == rate) {
            log.warn("환불 기간 만료 : payNo:{},rsvnNo:{}", refundCreateReqDto.getPayNo(), refundCreateReqDto.getRsvnNo());
            throw new CustomException(RefundErrorCode.REFUND_PERIOD_EXPIRED);
        }

        BigDecimal finalAmt = BigDecimal.valueOf(pay.getFinalAmt());
        BigDecimal rateBd = BigDecimal.valueOf(rate.getRate());
        BigDecimal divisor = BigDecimal.valueOf(100);

        BigDecimal refundAmt = finalAmt.multiply(rateBd).divide(divisor, 0, RoundingMode.DOWN);
        entity.applyRefund(rate, refundAmt);
        refundRepository.save(entity);
        return RefundResDto.from(entity);
    }

    public List<RefundResDto> findRefundAll() {
        return refundRepository.findAll().stream().map(RefundResDto::from).toList();
    }

    public RefundResDto findRefundByNo(Long no) {
        RefundEntity refundEntity = refundRepository.findById(no)
                .orElseThrow(() -> new CustomException(RefundErrorCode.REFUND_NOT_FOUND));
        return RefundResDto.from(refundEntity);
    }


    private RefundRate refundRate(RefundEntity entity) {
        LocalDateTime checkIn = entity.getRsvnNo().getCheckIn();
        LocalDateTime requestedAt = entity.getRequestedAt();
        long between = ChronoUnit.DAYS.between(requestedAt.toLocalDate(), checkIn.toLocalDate());

        if (between >= 7) {
            return RefundRate.WEEK;
        } else if (between >= 4) {
            return RefundRate.FOURTOSIX;
        } else if (between >= 2) {
            return RefundRate.TWOTOTHREE;
        } else if (between >= 1) {
            return RefundRate.ONEDAY;
        } else {
            return RefundRate.DDAY;
        }
    }
}
