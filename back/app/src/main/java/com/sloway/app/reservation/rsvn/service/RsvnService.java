package com.sloway.app.reservation.rsvn.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.dto.request.RefundCreateReqDto;
import com.sloway.app.payment.refund.service.RefundService;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.dto.request.RsvnReqDto;
import com.sloway.app.reservation.rsvn.dto.response.HostReservationStatsResDto;
import com.sloway.app.reservation.rsvn.dto.response.HostSpaceResDto;
import com.sloway.app.reservation.rsvn.dto.response.RsvnResDto;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import com.sloway.app.review.ReviewErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private final PayRepository payRepository;
    private final RefundService refundService;
    private final HostRepository hostRepository;
    private final HostPlaceRepository hostPlaceRepository;

    @Transactional
    public long save(Long memberNo, RsvnReqDto dto) {
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


        RsvnEntity entity = rsvnRepository.save(
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

        return entity.getNo();
    }

    //내 예약 목록 조회
    public List<RsvnResDto> findAll(Long memberNo) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );

        List<RsvnEntity> list = rsvnRepository.findByMemberNo(member);
        // 예약들의 payNo 를 한 번에 조회(N+1 제거)
        java.util.Map<Long, Long> payNoMap =
                findCompletePayNoMap(list.stream().map(RsvnEntity::getNo).toList());
        return list.stream()
                .map(entity -> RsvnResDto.from(entity, payNoMap.get(entity.getNo())))
                .toList();
    }

    //내 예약 상세 조회
    public RsvnResDto findOne(Long memberNo, Long rsvnNo) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        Long payNo = findCompletePayNo(entity.getNo());

        return RsvnResDto.from(entity, payNo);
    }

    //호스트 — 내 공간 목록 조회 (placeNo + 공간명)
    public List<HostSpaceResDto> findHostSpaces(Long memberNo) {
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        return hostPlaceRepository.findByHostEntityNo(host.getNo())
                .stream()
                .map(HostSpaceResDto::from)
                .filter(dto -> dto.getPlaceNo() != null)
                .distinct()
                .toList();
    }

    //어드민 — 특정 호스트의 공간 목록 조회 (hostNo 직접, 공간별 예약수 포함)
    public List<HostSpaceResDto> findHostSpacesForAdmin(Long hostNo) {
        List<RsvnEntity> rsvns = findRsvnsByHostNo(hostNo);

        // 공간(office/station/work) 별 예약 건수 — 각 FK 의 PK(getNo, LAZY 안전) 기준 count
        java.util.Map<Long, Long> officeCnt = rsvns.stream()
                .filter(r -> r.getOfficeNo() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getOfficeNo().getNo(), java.util.stream.Collectors.counting()));
        java.util.Map<Long, Long> stationCnt = rsvns.stream()
                .filter(r -> r.getStationNo() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getStationNo().getNo(), java.util.stream.Collectors.counting()));
        java.util.Map<Long, Long> workCnt = rsvns.stream()
                .filter(r -> r.getWorkStayNo() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getWorkStayNo().getNo(), java.util.stream.Collectors.counting()));

        return hostPlaceRepository.findByHostEntityNo(hostNo)
                .stream()
                .map(hp -> {
                    long cnt = 0L;
                    if (hp.getOfficeEntity() != null) {
                        cnt = officeCnt.getOrDefault(hp.getOfficeEntity().getNo(), 0L);
                    } else if (hp.getStationEntity() != null) {
                        cnt = stationCnt.getOrDefault(hp.getStationEntity().getNo(), 0L);
                    } else if (hp.getWorkStayEntity() != null) {
                        cnt = workCnt.getOrDefault(hp.getWorkStayEntity().getNo(), 0L);
                    }
                    return HostSpaceResDto.from(hp, cnt);
                })
                .filter(dto -> dto.getPlaceNo() != null)
                .distinct()
                .toList();
    }

    //호스트 — 내 공간의 예약 목록 조회
    public List<RsvnResDto> findAllByHost(Long memberNo) {
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        List<RsvnEntity> sorted = findRsvnsByHostNo(host.getNo()).stream()
                .sorted(java.util.Comparator.comparing(RsvnEntity::getCreatedAt).reversed())
                .toList();
        // 예약들의 payNo 를 한 번에 조회(N+1 제거)
        java.util.Map<Long, Long> payNoMap =
                findCompletePayNoMap(sorted.stream().map(RsvnEntity::getNo).toList());
        return sorted.stream()
                .map(entity -> RsvnResDto.from(entity, payNoMap.get(entity.getNo())))
                .toList();
    }

    public List<RsvnResDto> findAllByHostForAdmin(Long hostNo) {
        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));
        return findAllByHost(host.getMemberNo());
    }


    // 호스트 공간(office/station/work)의 예약 목록을 모아서 반환 (내부 헬퍼)
    private List<RsvnEntity> findRsvnsByHostNo(Long hostNo) {
        List<HostPlaceEntity> hostPlaces = hostPlaceRepository.findByHostEntityNo(hostNo);

        List<OfficeEntity> offices = hostPlaces.stream()
                .map(hp -> hp.getOfficeEntity()).filter(o -> o != null).toList();
        List<StationEntity> stations = hostPlaces.stream()
                .map(hp -> hp.getStationEntity()).filter(s -> s != null).toList();
        List<WorkStayEntity> workStays = hostPlaces.stream()
                .map(hp -> hp.getWorkStayEntity()).filter(w -> w != null).toList();

        List<RsvnEntity> result = new java.util.ArrayList<>();
        if (!offices.isEmpty())  result.addAll(rsvnRepository.findByOfficeNoIn(offices));
        if (!stations.isEmpty()) result.addAll(rsvnRepository.findByStationNoIn(stations));
        if (!workStays.isEmpty()) result.addAll(rsvnRepository.findByWorkStayNoIn(workStays));
        return result;
    }

    //어드민 — 특정 호스트의 예약 건수 통계 (진행중 P+S / 완료 E)
    public HostReservationStatsResDto findHostReservationStatsForAdmin(Long hostNo) {
        List<RsvnEntity> rsvns = findRsvnsByHostNo(hostNo);
        long ongoing = rsvns.stream()
                .filter(r -> r.getStatus() == RsvnStatus.P || r.getStatus() == RsvnStatus.S)
                .count();
        long completed = rsvns.stream()
                .filter(r -> r.getStatus() == RsvnStatus.E)
                .count();
        return HostReservationStatsResDto.of(ongoing, completed);
    }

    //내 예약 취소
    @Transactional
    public void cancel(Long memberNo, Long rsvnNo, RefundReason refundReason) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        if((entity.getStatus().equals(RsvnStatus.C))
                || (entity.getStatus().equals(RsvnStatus.R))
        ){
            throw new CustomException(RsvnErrorCode.ALREADY_CANCELLED);
        }

        if (entity.getStatus().equals((RsvnStatus.P))){
         entity.cancel();
         return;
        }

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

    //예약완료조회 (단건 — findOne 등에서 사용)
    public Long findCompletePayNo(Long rsvnNo){
        List<PayEntity> pay = payRepository.findByRsvn(rsvnNo);

        Long completedPay = pay.stream()
                .filter(p -> p.getStatus() == PayStatus.COMPLETED)
                .map(PayEntity::getNo)
                .findFirst()
                .orElse(null);
        return completedPay;
    }

    // 여러 예약의 완료결제 payNo 를 한 번에 조회 → Map<rsvnNo, payNo> (목록 조회 N+1 제거용)
    private java.util.Map<Long, Long> findCompletePayNoMap(List<Long> rsvnNos) {
        if (rsvnNos.isEmpty()) return java.util.Map.of();
        return payRepository.findByRsvnNoIn(rsvnNos).stream()
                .filter(p -> p.getStatus() == PayStatus.COMPLETED)
                .collect(java.util.stream.Collectors.toMap(
                        p -> p.getRsvnNo().getNo(),   // 예약 FK 의 PK
                        PayEntity::getNo,
                        (a, b) -> a                    // 한 예약에 완료결제 여러 건이면 첫 건
                ));
    }


    // 호스트 예약 거절
    @Transactional
    public void rejectByHost(Long memberNo, Long rsvnNo, Long payNo) {
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(()-> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));
        RsvnEntity entity = rsvnRepository.findById(rsvnNo)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));

        if(!entity.getStatus().equals(RsvnStatus.S)){
            throw new CustomException(RsvnErrorCode.RESERVATION_NOT_COMPLETED);
        }

        validateHostOwnership(host, entity);

        entity.reject();
        refundService.createRefundByHost(payNo);
    }

    // 호스트 소유 공간 검증 (내부 헬퍼)
    private void validateHostOwnership(HostEntity host, RsvnEntity rsvn) {

        if(rsvn.getOfficeNo() != null){
            boolean isOfficeOwner = hostPlaceRepository.existsByHostEntityNoAndOfficeEntityNo(host.getNo(), rsvn.getOfficeNo().getNo());
            if(!isOfficeOwner){
                throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
            }
        }
        if(rsvn.getStationNo() != null) {
            boolean isStationOwner = hostPlaceRepository.existsByHostEntityNoAndStationEntityNo(host.getNo(), rsvn.getStationNo().getNo());
            if(!isStationOwner) {
                throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
            }
        }
        if(rsvn.getWorkStayNo() != null) {
            boolean isWorkStayOwner = hostPlaceRepository.existsByHostEntityNoAndWorkStayEntityNo(host.getNo(), rsvn.getWorkStayNo().getNo());
            if (!isWorkStayOwner) {
                throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
            }
        }
    }

    //리뷰작성 가능 예약 목록 조회
    public List<RsvnResDto> findReviewable(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()-> new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));

        List<RsvnEntity> reviewable = rsvnRepository.findByMemberNoAndStatus(member, RsvnStatus.E)
                .stream()
                .filter(entity -> LocalDateTime.now().isBefore(entity.getCheckOut().plusDays(14)))
                .toList();
        // 예약들의 payNo 를 한 번에 조회(N+1 제거)
        java.util.Map<Long, Long> payNoMap =
                findCompletePayNoMap(reviewable.stream().map(RsvnEntity::getNo).toList());
        return reviewable.stream()
                .map(entity -> RsvnResDto.from(entity, payNoMap.get(entity.getNo())))
                .toList();
    }
}
