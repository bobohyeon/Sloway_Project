package com.sloway.app.recent.keyword.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.recent.keyword.dto.response.RecentKeywordResDto;
import com.sloway.app.recent.keyword.entity.RecentKeywordEntity;
import com.sloway.app.recent.keyword.repository.RecentKeywordRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
@Service
public class RecentKeywordService {

    private final RecentKeywordRepository recentKeywordRepository;
    private final MemberRepository memberRepository;

    //최근 검색어 저장(중복확인 후 오래된 순으로 제거)
    @Transactional
    public void save(Long memberNo, String keyword) {
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(() ->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );

        // 같은키워드 있으면 확인 후 삭제
        boolean isTrue = recentKeywordRepository.existsByMemberNoAndKeyword(member, keyword);
        if (isTrue) {
            recentKeywordRepository.deleteByMemberNoAndKeyword(member, keyword);
        }

        // 최근검색어 5개 이상이면 가장 오래된 검색어 찾아서 삭제 -> 아니면 저장
        if (recentKeywordRepository.countByMemberNo(member) >= 5) {
            List<RecentKeywordEntity> oldest = recentKeywordRepository.findTop1ByMemberNoOrderBySearchedAtAsc(member);
            if (!oldest.isEmpty()) {
                recentKeywordRepository.delete(oldest.getFirst());
            }
        }
        recentKeywordRepository.save(
                RecentKeywordEntity.builder()
                        .memberNo(member)
                        .keyword(keyword)
                        .build()
        );
    }

    //최근 검색어 목록 조회
    public List<RecentKeywordResDto> findAll(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );

        return recentKeywordRepository.findByMemberNoOrderBySearchedAtDesc(member)
                .stream()
                .map(RecentKeywordResDto::from)
                .toList();
    }

    //최근 검색어 개별 삭제
    @Transactional
    public void deleteOne(Long memberNo, Long keywordNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );

        recentKeywordRepository.deleteByNoAndMemberNo(keywordNo, member);
    }

    //최근 검색어 전체 삭제
    @Transactional
    public void deleteAll(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo).orElseThrow(()->
                new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND)
        );

        recentKeywordRepository.deleteByMemberNo(member);
    }

}
