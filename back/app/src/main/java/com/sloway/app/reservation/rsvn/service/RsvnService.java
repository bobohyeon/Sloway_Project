package com.sloway.app.reservation.rsvn.service;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.place.repository.office.OfficeRepository;
import com.sloway.app.place.repository.station.StationRepository;
import com.sloway.app.place.repository.workStay.WorkStayRepository;
import com.sloway.app.reservation.rsvn.dto.request.RsvnReqDto;
import com.sloway.app.reservation.rsvn.dto.response.RsvnResDto;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    @Transactional
    public void save(Long memberNo, RsvnReqDto dto){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new EntityNotFoundException("회원을 찾을 수 없습니다")
        );

        if(dto.getOfficeNo() != null){
            officeRepository.findById(dto.getOfficeNo());}
        else if(dto.getWorkStayNo() != null) {
            workStayRepository.findById(dto.getWorkStayNo());}
        else if(dto.getStationNo() != null) {
            stationRepository.findById(dto.getStationNo());
        }

        RsvnEntity.builder()
                .count(dto.getCount())
                .amt(dto.getAmt())
                .special(dto.getSpecial())
                .checkIn(dto.getCheckIn())
                .checkOut(dto.getCheckOut())

                .build();
    }

    //내 예약 목록 조회
    public List<RsvnResDto> findAll(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new EntityNotFoundException("회원을 찾을 수 없습니다")
        );
        return rsvnRepository.findByMemberNo(member)
                .stream()
                .map(RsvnResDto::from)
                .toList();
    }

    //내 예약 상세 조회
    public void findOne(Long memberNo, Long rsvnNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new EntityNotFoundException("회원을 찾을 수 없습니다")
        );
        Optional<RsvnEntity> entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member);

    }

    @Transactional
    public void cancel(Long memberNo, Long rsvnNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new EntityNotFoundException("회원을 찾을 수 없습니다")
        );
        RsvnEntity entity = rsvnRepository.findByNoAndMemberNo(rsvnNo, member).orElseThrow(() -> new EntityNotFoundException("오류"));
        entity.cancel();
    }
}
