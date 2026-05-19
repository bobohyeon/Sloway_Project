package com.sloway.app.payment.coupon.service;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.coupon.dto.request.CouponCreateReqDto;
import com.sloway.app.payment.coupon.dto.response.CouponResDto;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
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
public class CouponService {

    private final CouponRepository couponRepository;
    private final PayRepository payRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public CouponResDto createCoupon(CouponCreateReqDto couponCreateReqDto) {
        MemberEntity memberEntity = memberRepository.findById(couponCreateReqDto.getMemberNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));
        CouponEntity entity = couponCreateReqDto.toEntity(memberEntity);
        return CouponResDto.from(couponRepository.save(entity));
    }

    public List<CouponResDto> findCouponAll() {
        List<CouponResDto> couponList = couponRepository.findAll().stream().map(CouponResDto::from).toList();
        return couponList;
    }

    public CouponResDto findCouponByNo(Long no) {
        CouponEntity couponEntity = couponRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("쿠폰을 조회할 수 없습니다."));
        return CouponResDto.from(couponEntity);
    }

    @Transactional
    public void useCoupon(Long couponNo, Long payNo) {
        CouponEntity couponEntity = couponRepository.findById(couponNo)
                .orElseThrow(() -> new EntityNotFoundException("쿠폰을 조회할 수 없습니다."));
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new EntityNotFoundException("결제가 올바르지 않습니다."));
        couponEntity.useCoupon(payEntity);
    }
}
