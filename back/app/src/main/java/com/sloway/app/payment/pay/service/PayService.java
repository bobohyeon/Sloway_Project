package com.sloway.app.payment.pay.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponErrorCode;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayReadyResDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.pg.kakao.KakaoPayClient;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoApproveReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoReadyReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoReadyResDto;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.service.PointService;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PayService {

    private final PayRepository payRepository;
    private final CouponRepository couponRepository;
    private final RsvnRepository rsvnRepository;
    private final PointService pointService;
    private final KakaoPayClient kakaoPayClient;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public PayReadyResDto readyPay(PayCreateReqDto payCreateReqDto) {
        validAmt(payCreateReqDto);
        RsvnEntity rsvn = validRsvn(payCreateReqDto);

        Long memberNo = rsvn.getMemberNo().getNo();

        CouponEntity coupon = null;
        if (payCreateReqDto.getUcNo() != null) {
            coupon = couponRepository.findById(payCreateReqDto.getUcNo())
                    .orElseThrow(() -> new CustomException(CouponErrorCode.COUPON_NOT_FOUND));
        }

        int dcAmt = calculateDcAmt(coupon, payCreateReqDto.getBaseAmt());
        int usedPoint = payCreateReqDto.getUsedPoint() == null
                ? 0 : payCreateReqDto.getUsedPoint();

        int finalAmt = payCreateReqDto.getBaseAmt() + payCreateReqDto.getAddAmt()
                - dcAmt - usedPoint;

        validFinalAmt(payCreateReqDto, finalAmt, dcAmt, usedPoint);

        PayEntity payEntity = payCreateReqDto.toEntity(rsvn, coupon, dcAmt, finalAmt);
        payRepository.save(payEntity);

        KakaoReadyReqDto reqDto = KakaoReadyReqDto.builder()
                .partnerOrderId(payEntity.getNo().toString())
                .partnerUserId(memberNo.toString())
                .itemName("Sloway 공간예약")
                .quantity(1)
                .totalAmount(finalAmt)
                .taxFreeAmount(0)
                .approvalUrl(baseUrl + "/api/payment/pay/approve?payNo=" + payEntity.getNo())
                .cancelUrl(frontendUrl + "/user/payment/fail")
                .failUrl(frontendUrl + "/user/payment/fail")
                .build();

        KakaoReadyResDto readyResDto = kakaoPayClient.ready(reqDto);
        payEntity.assignTid(readyResDto.getTid());
        return PayReadyResDto.of(payEntity, readyResDto);
    }

    @Transactional
    public PayEntity approvePay(Long payNo, String pgToken) {
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        Long memberNo = payEntity.getRsvnNo().getMemberNo().getNo();

        KakaoApproveReqDto kakaoApproveReqDto = KakaoApproveReqDto.builder()
                .tid(payEntity.getTid())
                .partnerOrderId(payNo.toString())
                .partnerUserId(memberNo.toString())
                .pgToken(pgToken)
                .build();

        kakaoPayClient.approve(kakaoApproveReqDto);
        payEntity.approvePay();

        if (payEntity.getUcNo() != null) {
            payEntity.getUcNo().useCoupon(payEntity);
        }

        Integer usedPoint = payEntity.getUsedPoint();
        if (usedPoint != null && usedPoint > 0) {
            pointService.usePointInternal(memberNo, payEntity.getUsedPoint(), payEntity);
        }
        pointService.earnPointInternal(memberNo,payEntity);
        return payEntity;
    }


    // ============================================================
    // 토스페이 (Level 3 두 번째 PG) — 옵션 A: prepare 선행 방식
    // ============================================================

    // TODO: 토스 결제 준비 — 카카오 readyPay에서 "PG ready 호출" 부분만 빼고 거의 재활용
    //   @Transactional
    //   public ??? prepareTossPay(PayCreateReqDto payCreateReqDto) {
    //     1) validAmt(...) / validRsvn(...)            ← 기존 private 메서드 그대로 재활용
    //     2) memberNo 추출 (rsvn.getMemberNo().getNo())
    //     3) 쿠폰 조회 + calculateDcAmt(...)            ← 기존 재활용
    //     4) usedPoint NPE 방어 + finalAmt 계산 + validFinalAmt(...)
    //     5) payCreateReqDto.toEntity(...) + payRepository.save(...)
    //        ※ method가 TOSSPAY로 박히는지 PayCreateReqDto.toEntity 확인 (프론트가 method=TOSSPAY 전송)
    //     6) orderId 발급: "SLOWAY_" + payEntity.getNo()
    //        ※ 토스 orderId 제약 6~64자 → payNo만 쓰면 짧아서 prefix 필수
    //     7) 반환 → 프론트가 SDK 결제창 열 때 필요한 값 (orderId, amount=finalAmt, orderName)
    //        → 새 응답 DTO 필요 (TossPrepareResDto 빈 골격 만들어둠) — PayReadyResDto.of(...) 패턴 참고
    //   }
    //   ※ 카카오와 차이: kakaoPayClient.ready() 호출 X, tid 발급 X. 결제창은 프론트 SDK가 엶.

    // TODO: 토스 결제 승인(confirm) — 카카오 approvePay 흐름 재활용 + 금액검증 1단계 추가
    //   @Transactional
    //   public ??? confirmTossPay(String paymentKey, String orderId, Integer amount) {
    //     1) orderId에서 payNo 복원: orderId.replace("SLOWAY_", "") → Long.parseLong
    //        (또는 프론트가 payNo도 같이 넘기게 설계 — 둘 중 택1)
    //     2) payRepository.findById(payNo) + orElseThrow(PAY_NOT_FOUND)
    //     3) ★금액 위변조 검증: amount.equals(payEntity.getFinalAmt()) 아니면 throw
    //        (카카오엔 없던 단계 — 토스 문서가 강조. 다르면 PAY_AMOUNT_INVALID 류)
    //     4) tossPayClient.confirm(TossConfirmReqDto.builder()...build())  ← paymentKey/orderId/amount
    //     5) 응답 status가 "DONE"인지 검증 (아니면 throw)
    //     6) paymentKey 저장 → payEntity.assignTid(paymentKey) 재활용 고려
    //        ⚠️ 함정: assignTid는 status==READY 가드, approvePay()는 status를 COMPLETED로 바꿈
    //           → assignTid(paymentKey)를 approvePay() "전에" 호출해야 가드 통과 (순서 주의!)
    //     7) payEntity.approvePay()                     ← 기존 Rich 재활용
    //     8) 쿠폰 useCoupon / 포인트 usePointInternal / earnPointInternal  ← approvePay()의 후처리 그대로
    //   }
    //   ※ 6~8단계는 기존 approvePay(Long, String)의 후반부와 거의 동일 → 중복 보이면 private 헬퍼로 추출 고려

    private int calculateDcAmt(CouponEntity coupon, Integer baseAmt) {
        if (coupon == null) return 0;
        if (coupon.getDcType() == CouponDcType.FIXED) {
            return coupon.getDcValue();
        } else if (coupon.getDcType() == CouponDcType.RATE) {
            return baseAmt * coupon.getDcValue() / 100;
        }
        return 0;
    }

    public List<PayResDto> findPayAll() {
        return payRepository.findAll().stream().map(PayResDto::from).toList();
    }

    public PayResDto findPayByNo(Long no) {
        PayEntity entity = payRepository.findById(no)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        return PayResDto.from(entity);
    }

    public List<PayResDto> findPaysByMemberNo(Long memberNo) {
        List<PayEntity> payEntityList = payRepository.findByMember(memberNo);
        return payEntityList.stream().map(PayResDto::from).toList();
    }

    private void validAmt(PayCreateReqDto payCreateReqDto) {
        if (payCreateReqDto.getBaseAmt() == null || payCreateReqDto.getBaseAmt() <= 0 ||
                payCreateReqDto.getAddAmt() == null || payCreateReqDto.getAddAmt() < 0) {
            log.warn("결제 금액 이상치 baseAmt={}, addAmt={}", payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }
    }

    private RsvnEntity validRsvn(PayCreateReqDto payCreateReqDto) {
        return rsvnRepository.findById(payCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new EntityNotFoundException("예약 정보를 조회할 수 없습니다."));
    }

    private void validFinalAmt(PayCreateReqDto payCreateReqDto, int finalAmt, int dcAmt, int usedPoint) {
        if (finalAmt < 0) {
            log.warn("음수 finalAmt 발생 baseAmt={}, addAmt={}, dcAmt={}, usedPoint={}",
                    payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt(),
                    dcAmt, usedPoint
            );
            throw new CustomException(PayErrorCode.PAY_AMOUNT_NEGATIVE);
        }
    }

}
