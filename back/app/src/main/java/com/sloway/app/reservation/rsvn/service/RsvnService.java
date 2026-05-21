package com.sloway.app.reservation.rsvn.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.service.PayService;
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

    @Transactional
    public void save(Long memberNo, RsvnReqDto dto){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));

        OfficeEntity office = null;
        WorkStayEntity workStay = null;
        StationEntity station = null;

        if(dto.getOfficeNo() != null){
            office = officeRepository.findById(dto.getOfficeNo()).orElseThrow(()->
                    new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        }
        else if(dto.getWorkStayNo() != null) {
            workStay = workStayRepository.findById(dto.getWorkStayNo()).orElseThrow(()->
                    new CustomException(RsvnErrorCode.PLACE_NOT_FOUND));
        }
        else if(dto.getStationNo() != null) {
            station = stationRepository.findById(dto.getStationNo()).orElseThrow(()->
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


        // TODO: PayCreateReqDto 조립 후 createPay() 호출
        //       힌트: new PayCreateReqDto() 는 안 됨 — @Getter만 있고 생성자가 없음
        //             별도 빌더나 정적 팩토리 메서드가 필요하거나 우영님께 확인 필요
        //       필요한 값: savedRsvn.getNo(), dto.getAmt()(=baseAmt), dto.getAddAmt(),
        //                 dto.getMethod(), dto.getUcNo(), dto.getUsedPoint()
    }

    //내 예약 목록 조회
    public List<RsvnResDto> findAll(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        return rsvnRepository.findByMemberNo(member)
                .stream()
                .map(RsvnResDto::from)
                .toList();
    }

    //내 예약 상세 조회
    public RsvnResDto findOne(Long memberNo, Long rsvnNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        return RsvnResDto.from(entity);
    }

    //내 예약 취소
    @Transactional
    public void cancel(Long memberNo, Long rsvnNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
        entity.cancel();

        // TODO: PayRepository에서 해당 예약의 결제 조회
        //       힌트: payRepository.findByRsvnNo(entity) — 우영님 추가 후 사용 가능
        //       조회 실패 시 예외 처리 필요

        // TODO: RefundCreateReqDto 조립 후 refundService.createRefund() 호출
        //       필요한 값: payEntity.getNo(), entity.getNo(), 환불 사유(RefundReason)
        //       환불 사유는 어떻게 받을지 결정 필요 (cancel() 파라미터에 추가? 고정값?)
    }

    // 호스트 예약 거절
    @Transactional
    public void rejectByHost(Long rsvnNo, Long payNo) {
        RsvnEntity entity = rsvnRepository.findById(rsvnNo)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        // TODO: entity.reject() 호출

        // TODO: refundService.createRefundByHost(payNo) 호출
        //       RefundService 필드 주입도 필요
    }
}
