package com.sloway.app.payment.couponevent.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.coupon.common.CouponStatus;
import com.sloway.app.payment.coupon.dto.response.CouponResDto;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
import com.sloway.app.payment.couponevent.common.CouponEventErrorCode;
import com.sloway.app.payment.couponevent.dto.request.CouponEventCreateReqDto;
import com.sloway.app.payment.couponevent.dto.response.CouponEventResDto;
import com.sloway.app.payment.couponevent.entity.CouponEventEntity;
import com.sloway.app.payment.couponevent.repository.CouponEventRepository;
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
public class CouponEventService {

    private final CouponEventRepository couponEventRepository;
    private final CouponRepository couponRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public CouponEventResDto createEvent(CouponEventCreateReqDto reqDto) {
        CouponEventEntity couponEventEntity = reqDto.toEntity();
        CouponEventEntity entity = couponEventRepository.save(couponEventEntity);
        return CouponEventResDto.from(entity);
    }

    public List<CouponEventResDto> findEventAll() {
        return couponEventRepository.findAll().stream().map(CouponEventResDto::from).toList();
    }

    @Transactional
    public CouponEventResDto closeEvent(Long no) {
        CouponEventEntity couponEventEntity = couponEventRepository.findById(no)
                .orElseThrow(() -> new CustomException(CouponEventErrorCode.COUPONEVENT_NOT_FOUND));
        couponEventEntity.close();

        List<CouponEntity> issuedCoupons =
                couponRepository.findByCouponEventAndStatus(no, CouponStatus.AVAILABLE);
        issuedCoupons.forEach(CouponEntity::expireCoupon);

        return CouponEventResDto.from(couponEventEntity);
    }

    @Transactional
    public CouponResDto downloadCoupon(Long eventNo, Long memberNo) {
        CouponEventEntity couponEventEntity = couponEventRepository.findById(eventNo)
                .orElseThrow(() -> new CustomException(CouponEventErrorCode.COUPONEVENT_NOT_FOUND));

        if (couponEventRepository.existsByEventAndMember(eventNo, memberNo)) {
            throw new CustomException(CouponEventErrorCode.COUPONEVENT_ALREADY_DOWNLOADED);
        }

        MemberEntity memberEntity = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        LocalDateTime expiredAt = LocalDateTime.now().plusDays(couponEventEntity.getValidDays());

        CouponEntity couponEntity = CouponEntity.builder()
                .couponName(couponEventEntity.getCouponName())
                .dcType(couponEventEntity.getDcType())
                .dcValue(couponEventEntity.getDcValue())
                .memberNo(memberEntity)
                .expiredAt(expiredAt)
                .status(CouponStatus.AVAILABLE)
                .couponEventNo(couponEventEntity)
                .build();
        CouponEntity savedEntity = couponRepository.save(couponEntity);
        couponEventEntity.issue();
        return CouponResDto.from(savedEntity);
    }

}
