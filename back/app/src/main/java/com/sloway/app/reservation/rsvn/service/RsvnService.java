package com.sloway.app.reservation.rsvn.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.pay.service.PayService;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.dto.request.RefundCreateReqDto;
import com.sloway.app.payment.refund.service.RefundService;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.dto.request.RsvnReqDto;
import com.sloway.app.reservation.rsvn.dto.response.RsvnResDto;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class RsvnService {

    private final RsvnRepository rsvnRepository;
    private final MemberRepository memberRepository;
    private final WorkStayRepository workStayRepository;
    private final OfficeRepository officeRepository;
    private final StationRepository stationRepository;
    private final PayService payService;
    private final PayRepository payRepository;
    private final RefundService refundService;

    @Transactional
    public void save(Long memberNo, RsvnReqDto dto) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));

        OfficeEntity office = null;
        WorkStayEntity workStay = null;
        StationEntity station = null;

        if (dto.getOfficeNo() != null) {
            office = officeRepository.findById(dto.getOfficeNo()).orElseThrow(() ->
                    new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        } else if (dto.getWorkStayNo() != null) {
            workStay = workStayRepository.findById(dto.getWorkStayNo()).orElseThrow(() ->
                    new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        } else if (dto.getStationNo() != null) {
            station = stationRepository.findById(dto.getStationNo()).orElseThrow(() ->
                    new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        }

        // rsvnRepository.save() 반환값을 RsvnEntity 변수로 받기
        RsvnEntity savedRsvn = rsvnRepository.save(
                RsvnEntity.builder()
                        .memberNo(member)
                        .officeNo(office)
                        .workStayNo(workStay)
                        .stationNo(station)
                        .count(dto.getCount())
                        .amt(dto.getAmt())
                        .special(dto.getSpecial())
                        .checkIn(dto.getCheckIn())
                        .checkOut(dto.getCheckOut())
                        .build()
        );

        PayCreateReqDto payCreateReqDto = PayCreateReqDto.builder()
                .rsvnNo(savedRsvn.getNo())
                .baseAmt(savedRsvn.getAmt())
                .addAmt(dto.getAddAmt())
                .method(dto.getMethod())
                .ucNo(dto.getUcNo())
                .usedPoint(dto.getUsedPoint())
                .build();

        payService.createPay(payCreateReqDto);
    }

    //내 예약 목록 조회
    public List<RsvnResDto> findAll(Long memberNo) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        return rsvnRepository.findByMemberNo(member)
                .stream()
                .map(RsvnResDto::from)
                .toList();
    }

    //내 예약 상세 조회
    public RsvnResDto findOne(Long memberNo, Long rsvnNo) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        return RsvnResDto.from(entity);
    }

    //내 예약 취소
    @Transactional
    public void cancel(Long memberNo, Long rsvnNo, RefundReason refundReason) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
        entity.cancel();

        List<PayEntity> pay = payRepository.findByRsvn(rsvnNo);

        // 해당예약의 결제완료건만 가져오기
        PayEntity completedPay = pay.stream()
                .filter(p -> p.getStatus() == PayStatus.COMPLETED)
                .findFirst()
                .orElseThrow(()-> new CustomException(PayErrorCode.PAY_NOT_FOUND));

        RefundCreateReqDto refundCreateReqDto = RefundCreateReqDto.builder()
                .rsvnNo(entity.getNo())
                .payNo(completedPay.getNo())
                .refundReason(refundReason)
                .build();

        refundService.createRefund(refundCreateReqDto);
    }

    // 호스트 예약 거절
    @Transactional
    public void rejectByHost(Long rsvnNo, Long payNo) {
        RsvnEntity entity = rsvnRepository.findById(rsvnNo)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        entity.reject();
        refundService.createRefundByHost(payNo);
    }
}
