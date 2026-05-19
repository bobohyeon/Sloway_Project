package com.sloway.app.auth.service;

import com.sloway.app.auth.dto.response.UserResponseDto;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 일반회원 정보 관리 서비스  - 마이페이지
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final MemberRepository memberRepository;

    public UserResponseDto getMyInfo(Long memberNo){
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(
                        ()->new IllegalArgumentException("회원을 찾을 수 없습니다")
                );

        return UserResponseDto.from(member);
    }

}
