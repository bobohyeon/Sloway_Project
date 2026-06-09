package com.sloway.app.reservation.blackOut.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.blackOut.dto.request.BlackOutReqDto;
import com.sloway.app.reservation.blackOut.dto.response.BlackOutResDto;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import com.sloway.app.reservation.blackOut.repository.BlackOutRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import com.sloway.app.review.ReviewErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class BlackOutService {

    private final BlackOutRepository blackOutRepository;
    private final HostRepository hostRepository;
    private final HostPlaceRepository hostPlaceRepository;
    private final OfficeRepository officeRepository;
    private final WorkStayRepository workStayRepository;
    private final StationRepository stationRepository;
    private final RsvnRepository rsvnRepository;


    @Transactional
    public void save(Long memberNo, Long entityNo, BlackOutReqDto dto){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        OfficeEntity office = officeRepository.findById(entityNo).orElse(null);
        StationEntity station = office == null ? stationRepository.findById(entityNo).orElse(null) : null;
        WorkStayEntity workStay = (office == null && station == null)
                ? workStayRepository.findById(entityNo).orElse(null) : null;

        if(office == null && station == null && workStay == null){
            throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        }

        validateHostOwnership(host, office, station, workStay);

        // 해당 기간에 확정 예약이 있으면 블랙아웃 등록 불가
        long overlapping = rsvnRepository.countOverlappingRsvn(
                office, station, workStay,
                dto.getStartDate(), dto.getEndDate(),
                RsvnStatus.S);
        if (overlapping > 0) {
            throw new CustomException(RsvnErrorCode.RSVN_EXISTS_IN_PERIOD);
        }

        blackOutRepository.save(dto.toEntity(office, station, workStay));
    }

    public List<BlackOutResDto> findAll(Long entityNo){
        OfficeEntity office = officeRepository.findById(entityNo).orElse(null);
        StationEntity station = office == null ? stationRepository.findById(entityNo).orElse(null) : null;
        WorkStayEntity workStay = (office == null && station == null)
                ? workStayRepository.findById(entityNo).orElse(null) : null;

        List<BlackOutEntity> list;
        if(office != null){
            list = blackOutRepository.findByOfficeNo(office);
        }else if(station != null){
            list = blackOutRepository.findByStationNo(station);
        }else if(workStay != null){
            list = blackOutRepository.findByWorkStayNo(workStay);
        }else {
            throw new CustomException(RsvnErrorCode.PLACE_NOT_FOUND);
        }

        return list.stream().map(BlackOutResDto::from).toList();
    }

    // 호스트 달력용 — 내 모든 공간의 블랙아웃 한번에 조회
    public List<BlackOutResDto> findAllByHost(Long memberNo){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));

        List<HostPlaceEntity> hostPlaces = hostPlaceRepository.findByHostEntityNo(host.getNo());

        List<BlackOutEntity> result = new ArrayList<>();
        for (HostPlaceEntity hp : hostPlaces) {
            if (hp.getOfficeEntity() != null) {
                result.addAll(blackOutRepository.findByOfficeNo(hp.getOfficeEntity()));
            } else if (hp.getStationEntity() != null) {
                result.addAll(blackOutRepository.findByStationNo(hp.getStationEntity()));
            } else if (hp.getWorkStayEntity() != null) {
                result.addAll(blackOutRepository.findByWorkStayNo(hp.getWorkStayEntity()));
            }
        }

        return result.stream().map(BlackOutResDto::from).toList();
    }


    @Transactional
    public void editBlackOut(Long memberNo, Long no, BlackOutReqDto dto){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));
        BlackOutEntity entity = blackOutRepository.findById(no)
                .orElseThrow(()->new CustomException(RsvnErrorCode.BLACKOUT_NOT_FOUND));

        validateHostOwnershipByBlackOut(host, entity);

        entity.editBlackOut(
                dto.getTitle()
                ,dto.getMemo()
                ,dto.getReasonType()
                ,dto.getStartDate()
                ,dto.getEndDate()
                ,dto.getStartTime()
                ,dto.getEndTime()
        );
    }

    @Transactional
    public void deleteBlackOut(Long memberNo, Long no){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(ReviewErrorCode.HOST_NOT_FOUND));
        BlackOutEntity entity = blackOutRepository.findById(no)
                .orElseThrow(() -> new CustomException(RsvnErrorCode.BLACKOUT_NOT_FOUND));

        validateHostOwnershipByBlackOut(host, entity);

        blackOutRepository.delete(entity);
    }

    private void validateHostOwnership(HostEntity host, OfficeEntity office, StationEntity station, WorkStayEntity workStay) {
        if(office != null){
            boolean isOfficeOwner = hostPlaceRepository.existsByHostEntityNoAndOfficeEntityNo(host.getNo(), office.getNo());
            if(!isOfficeOwner) throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }
        if(station != null) {
            boolean isStationOwner = hostPlaceRepository.existsByHostEntityNoAndStationEntityNo(host.getNo(), station.getNo());
            if(!isStationOwner) throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }
        if(workStay != null) {
            boolean isWorkStayOwner = hostPlaceRepository.existsByHostEntityNoAndWorkStayEntityNo(host.getNo(), workStay.getNo());
            if (!isWorkStayOwner) throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
        }
    }

    private void validateHostOwnershipByBlackOut(HostEntity host, BlackOutEntity entity){
        validateHostOwnership(host, entity.getOfficeNo(), entity.getStationNo(), entity.getWorkStayNo());
    }
}
