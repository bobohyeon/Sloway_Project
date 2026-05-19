package com.sloway.app.recent.viewed.service;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.repository.place.PlaceRepository;
import com.sloway.app.recent.viewed.dto.response.RecentViewedResDto;
import com.sloway.app.recent.viewed.entity.RecentViewedEntity;
import com.sloway.app.recent.viewed.repository.RecentViewedRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class RecentViewedService {

    private final RecentViewedRepository recentViewedRepository;
    private final MemberRepository memberRepository;
    private final PlaceRepository placeRepository;

    @Transactional
    public void save(Long memberNo, Long placeNo){
        MemberEntity member = memberRepository.findById(memberNo)
                        .orElseThrow(()-> new EntityNotFoundException("회원을 찾을 수 없습니다."));
        PlaceEntity place = placeRepository.findByNo(placeNo)
                        .orElseThrow(()-> new EntityNotFoundException("해당 공간을 찾을 수 없습니다."));

        //같은 공간 있으면 삭제
        boolean isTrue = recentViewedRepository.existsByMemberNoAndPlaceNo(member ,place);
        if(isTrue){
            recentViewedRepository.deleteByMemberNoAndPlaceNo(member, place);
        }

        //10개 이상이면 가장 오래된 공간 지우기
        if(recentViewedRepository.countByMemberNo(member) >= 10){
            List<RecentViewedEntity> oldest = recentViewedRepository.findTop1ByMemberNoOrderByViewAtAsc(member);
            if(!oldest.isEmpty()){
                recentViewedRepository.delete(oldest.getFirst());
            }
        }
            recentViewedRepository.save(
                    RecentViewedEntity.builder()
                            .memberNo(member)
                            .placeNo(place)
                            .build()
            );
        }


    //최근 본 공간 목록 조회
    public List<RecentViewedResDto> findAll(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()-> new EntityNotFoundException("회원을 찾을 수 없습니다."));
        return recentViewedRepository.findByMemberNoOrderByViewAtDesc(member)
                .stream()
                .map(RecentViewedResDto::from)
                .toList();
    }

    //단건 삭제
    @Transactional
    public void deleteOne(Long no, Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()-> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        recentViewedRepository.deleteByNoAndMemberNo(no, member);
    }

    //전체 삭제
    @Transactional
    public void deleteAll(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()-> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        recentViewedRepository.deleteByMemberNo(member);
    }
}
