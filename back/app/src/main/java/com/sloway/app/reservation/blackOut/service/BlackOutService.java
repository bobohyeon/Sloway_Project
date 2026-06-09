package com.sloway.app.reservation.blackOut.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
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
import com.sloway.app.review.ReviewErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // 호스트 소유 공간 검증 (내부 헬퍼)
    private void validateHostOwnership(HostEntity host, OfficeEntity office, StationEntity station, WorkStayEntity workStay) {

        if(office != null){
            boolean isOfficeOwner = hostPlaceRepository.existsByHostEntityNoAndOfficeEntityNo(host.getNo(), office.getNo());
            if(!isOfficeOwner){
                throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
            }
        }
        if(station != null) {
            boolean isStationOwner = hostPlaceRepository.existsByHostEntityNoAndStationEntityNo(host.getNo(), station.getNo());
            if(!isStationOwner) {
                throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
            }
        }
        if(workStay != null) {
            boolean isWorkStayOwner = hostPlaceRepository.existsByHostEntityNoAndWorkStayEntityNo(host.getNo(), workStay.getNo());
            if (!isWorkStayOwner) {
                throw new CustomException(RsvnErrorCode.UNAUTHORIZED_ACCESS);
            }
        }
    }

    private void validateHostOwnershipByBlackOut(HostEntity host, BlackOutEntity entity){
        validateHostOwnership(host, entity.getOfficeNo(), entity.getStationNo(), entity.getWorkStayNo());
    }

}
