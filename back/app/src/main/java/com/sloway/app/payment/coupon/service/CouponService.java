package com.sloway.app.payment.coupon.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.coupon.common.CouponErrorCode;
import com.sloway.app.payment.coupon.dto.request.CouponCreateReqDto;
import com.sloway.app.payment.coupon.dto.response.CouponResDto;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
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
    private final MemberRepository memberRepository;

    @Transactional
    public CouponResDto createCoupon(CouponCreateReqDto couponCreateReqDto) {
        MemberEntity memberEntity = findMember(couponCreateReqDto.getMemberNo());
        CouponEntity entity = couponCreateReqDto.toEntity(memberEntity);
        return CouponResDto.from(couponRepository.save(entity));
    }

    public List<CouponResDto> findCouponAll() {
        List<CouponResDto> couponList = couponRepository.findAll().stream().map(CouponResDto::from).toList();
        return couponList;
    }

    public CouponResDto findCouponByNo(Long no) {
        CouponEntity couponEntity = couponRepository.findById(no)
                .orElseThrow(() -> new CustomException(CouponErrorCode.COUPON_NOT_FOUND));
        return CouponResDto.from(couponEntity);
    }


    public List<CouponResDto> findCouponsByMemberNo(Long no) {
        MemberEntity memberEntity = findMember(no);
        // 쿠폰함은 전체 상태를 내려주고 프론트가 탭(사용가능/사용완료/만료)으로 분류 — AVAILABLE 고정 조회가 사용완료 쿠폰을 숨기던 버그 수정
        List<CouponEntity> memberCouponList = couponRepository.findByMember(memberEntity.getNo());
        return memberCouponList.stream().map(CouponResDto::from).toList();
    }

    private MemberEntity findMember(Long memberNo) {
        return memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
    }
}
