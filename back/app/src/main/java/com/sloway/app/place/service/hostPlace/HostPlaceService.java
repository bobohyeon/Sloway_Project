package com.sloway.app.place.service.hostPlace;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.place.dto.request.hostPlace.HostPlaceRejectReqDto;
import com.sloway.app.place.dto.response.hostPlace.ApprovalCheckRespDto;
import com.sloway.app.place.dto.response.hostPlace.ApprovalDetailRespDto;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HostPlaceService {

    private final HostPlaceRepository hostPlaceRepository;
    private final HostRepository hostRepository;
    private final PlaceRepository placeRepository;
    private final WorkStayRepository workStayRepository;
    private final OfficeRepository officeRepository;
    private final StationRepository stationRepository;

    @Transactional
    public void insertHostPlace(String type, Long hostNo, Long entityNo) {
        HostEntity host = hostRepository.findById(Long.valueOf(1))
                  .orElseThrow(()->new EntityNotFoundException("[HOST-280] Host Not Found For Save HostPlace"));
        switch (type) {
            case "W" -> {
                WorkStayEntity workStay = workStayRepository.findById(entityNo)
                        .orElseThrow(() -> new EntityNotFoundException("[WORKSTAY-281]WorkStay Not Found For Save HostPlace"));

                HostPlaceEntity hostPlace = HostPlaceEntity.builder()
                        .workStayEntity(workStay)
                        .hostEntity(host)
                        .build();

                hostPlaceRepository.save(hostPlace);

            }
            case "C" -> {
                OfficeEntity office = officeRepository.findById(entityNo)
                        .orElseThrow(() -> new EntityNotFoundException("[OFFICE-281]Office Not Found For Save HostPlace"));

                HostPlaceEntity hostPlace = HostPlaceEntity.builder()
                        .officeEntity(office)
                        .hostEntity(host)
                        .build();

                hostPlaceRepository.save(hostPlace);

            }
            case "S" -> {
                StationEntity station = stationRepository.findById(entityNo)
                        .orElseThrow(() -> new EntityNotFoundException("[STATION-281]Station Not Found For Save HostPlace"));

                HostPlaceEntity hostPlace = HostPlaceEntity.builder()
                        .stationEntity(station)
                        .hostEntity(host)
                        .build();

                hostPlaceRepository.save(hostPlace);

            }
            case "P" -> {
                PlaceEntity place = placeRepository.findByNo(entityNo)
                        .orElseThrow(() -> new EntityNotFoundException("[PLACE-281]Place Not Found For Save HostPlace"));

                HostPlaceEntity hostPlace = HostPlaceEntity.builder()
                        .placeEntity(place)
                        .hostEntity(host)
                        .build();

                hostPlaceRepository.save(hostPlace);
            }
        }//switch

    }//method

    @Transactional
    public void approveHostPlace(Long no) {
        HostPlaceEntity hostPlace = hostPlaceRepository.findById(no)
                .orElseThrow(()-> new EntityNotFoundException("[H.P-281]HostPlace Not Found For Approve"));
        hostPlace.approve();
        hostPlaceRepository.save(hostPlace);
    }

    @Transactional
    public void rejectHostPlace(Long no, HostPlaceRejectReqDto dto) {
        System.out.println("dto = " + dto);
        HostPlaceEntity hostPlace = hostPlaceRepository.findById(no)
                .orElseThrow(()-> new EntityNotFoundException("[H.P-282]HostPlace Not Found For Reject"));
        hostPlace.reject(dto.getRejectedReason());
        hostPlaceRepository.save(hostPlace);
    }

    public List<HostPlaceListRespDto> hostPlaceList() {
        return hostPlaceRepository.findHostPlaceList();
    }

    public ApprovalCheckRespDto checkRejectReason(String type, Long no, Long memberNo) {
        return hostPlaceRepository.checkRejectReason(type, no, memberNo);
    }

    public ApprovalDetailRespDto detailApproval(String type, Long no) {
        // 2. 타입에 따른 상세 정보 및 이미지 조회 (분기)
        switch (type) {
            case "PLACE":
                return hostPlaceRepository.findCommonData(no);
            case "STATION":
                return hostPlaceRepository.findStationDetail(no);
            case "OFFICE":
                return hostPlaceRepository.findOfficeDetail(no);
            case "WORK_STAY":
                return hostPlaceRepository.findWorkStayDetail(no);
        }
        return null;
    }
}//class
