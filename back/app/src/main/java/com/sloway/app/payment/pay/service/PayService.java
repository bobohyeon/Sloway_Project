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
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoReadyReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoReadyResDto;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.service.PointService;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
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
    private final CouponRepository couponRepository;
    private final RsvnRepository rsvnRepository;
    private final PointService pointService;
    private final KakaoPayClient kakaoPayClient;

    @Transactional
    public PayResDto createPay(PayCreateReqDto payCreateReqDto) {

        if (payCreateReqDto.getBaseAmt() == null || payCreateReqDto.getBaseAmt() <= 0 ||
                payCreateReqDto.getAddAmt() == null || payCreateReqDto.getAddAmt() < 0) {
            log.warn("결제 금액 이상치 baseAmt={}, addAmt={}", payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }

        RsvnEntity rsvn = rsvnRepository.findById(payCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new EntityNotFoundException("예약 정보를 조회할 수 없습니다."));

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

        if (finalAmt < 0) {
            log.warn("음수 finalAmt 발생 baseAmt={}, addAmt={}, dcAmt={}, usedPoint={}",
                    payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt(),
                    dcAmt, usedPoint
            );
            throw new CustomException(PayErrorCode.PAY_AMOUNT_NEGATIVE);
        }

        PayEntity entity = payCreateReqDto.toEntity(rsvn, coupon, dcAmt, finalAmt);
        payRepository.save(entity);

        if (usedPoint > 0) {
            pointService.usePointInternal(memberNo, usedPoint, entity);
        }

        if (coupon != null) {
            coupon.useCoupon(entity);
        }

        String fakeTid = createFakeTid();
        entity.completeAsLevel1(fakeTid);
        return PayResDto.from(entity);
    }

    // ─────────────────────────────────────────────────────────────
    // TODO: Level 3 — 외부 PG(카카오페이) ready 단계
    //   목표: 결제창을 띄우기 직전, 카카오에 "결제 준비" 요청 → tid + redirect URL 받기.
    //         createPay 처럼 즉시 COMPLETED 가 아니라, READY 상태로만 저장하고 카카오로 넘긴다.
    //
    //   의존성 먼저: KakaoPayClient 를 이 서비스에 주입 (위쪽 final 필드 영역에 추가)
    //
    //   메서드 시그니처부터 생각:
    //     - 반환 타입? 프론트(BookingPayment)가 redirect 하려면 payNo + nextRedirectPcUrl 이 필요.
    //       기존 PayResDto 에는 redirect URL 이 없으니 새 ResDto(PayReadyResDto) 를 만들지 결정.
    //     - 파라미터? createPay 와 같은 입력(PayCreateReqDto)으로 충분한지.
    //     - 쓰기 작업이니 @Transactional 필요.
    //
    //   흐름 7단계:
    //   1) 진입 검증 — createPay 상단 금액 검증(baseAmt/addAmt null·범위) 재사용 고민
    //   2) 예약 조회 → memberNo 추출 (createPay 의 rsvnRepository.findById + getMemberNo 패턴)
    //   3) PayEntity 를 READY 상태로 생성 + save → payNo 발급
    //      ※ createPay 는 toEntity 후 completeAsLevel1 로 바로 COMPLETED 까지 간다.
    //        여기선 save 까지만. (쿠폰/포인트 차감을 ready 시점에 할지 approve 시점에 할지 생각)
    //   4) KakaoReadyReqDto 빌드:
    //      - cid: KakaoPayClient 가 이미 @Value 로 cid 를 들고 있음 → 누가 채울지 결정
    //        (호출자가 채워 보낼지, Client 가 내부에서 채울지)
    //      - partnerOrderId = payNo, partnerUserId = memberNo
    //        ※ 위에서 짚은 partnerOrderId 의 @JsonProperty 누락 확인하고 넘어갈 것
    //      - itemName / quantity / totalAmount(finalAmt) / taxFreeAmount(0)
    //      - approvalUrl = 백엔드 콜백 (예: /api/payment/pay/approve?payNo={payNo}) — 우리 서버 주소
    //        (서버 주소도 코드 인라인 말고 properties + @Value 로 빼는 게 일관)
    //      - cancelUrl / failUrl = 프론트 실패 페이지
    //   5) kakaoPayClient.ready(reqDto) 호출 → KakaoReadyResDto (tid + nextRedirectPcUrl)
    //   6) 응답의 tid 를 PayEntity 에 저장 — approve/cancel 때 필요
    //      ※ 지금 PayEntity 엔 READY 상태에서 tid 만 저장하는 Rich 메서드가 없다.
    //        completeAsLevel1 은 COMPLETED 로 전이시켜버려 부적합 → 새 Rich 메서드 검토
    //   7) PayReadyResDto(payNo, nextRedirectPcUrl) 반환
    // ─────────────────────────────────────────────────────────────


//    public PayReadyResDto readyReqDto(PayCreateReqDto payCreateReqDto){
//
//    }


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

    private String createFakeTid() {
        return "FAKE_" + UUID.randomUUID().toString().substring(0, 12);
    }


}
