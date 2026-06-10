package com.sloway.app.host.service;

import com.sloway.app.auth.dto.request.ChangePasswordRequestDto;
import com.sloway.app.auth.service.EmailService;
import com.sloway.app.aws.service.S3Service;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.common.util.PasswordValidator;
import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.dto.request.HostReapplyRequestDto;
import com.sloway.app.host.dto.request.UpdateHostRequestDto;
import com.sloway.app.host.dto.response.HostApplicationResponseDto;
import com.sloway.app.host.dto.response.HostMyPageResponseDto;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.dto.request.ChangeEmailRequestDto;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 호스트 — 본인 영역 서비스.
 *
 * <p>호스트가 자기 정보를 조회/수정/탈퇴할 때 사용.
 * 어드민 시점의 호스트 관리는 AdminHostService에서 별도 처리.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HostService {

    private final MemberRepository memberRepository;
    private final HostRepository hostRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final S3Service s3Service;

    public HostMyPageResponseDto hostMyInfo(Long memberNo) {
        // 1) 회원 조회 (없으면 404)
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
        // 2) 호스트 조회 — memberNo가 외래키
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 3) DTO 변환
        return HostMyPageResponseDto.from(member, host);

    }

    /**
     * 호스트 활동 가능 여부 검증 (이용 제한 게이트).
     * <p>
     * 승인(A) 상태가 아니면 호스트 기능을 막는다. 호스트 활동성 API
     * (공간 등록·운영 등) 진입부에서 호출. 단, 마이페이지·계정 관리
     * (조회/수정/비번/이메일/탈퇴)는 승인과 무관하게 허용하므로 여기서 막지 않는다.
     * <p>
     * 로그인 자체는 허용되므로(미승인도 토큰 발급), 이 검증은 인증이 아닌
     * "자격" 차원의 차단이다 → 403 FORBIDDEN.
     */

    public void assertApproved(Long memberNo){
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(()->new CustomException(HostErrorCode.HOST_NOT_FOUND));

        if (host.getApprovalState() != ApprovalState.A){
            throw new CustomException(HostErrorCode.HOST_NOT_FOUND);
        }
    }

    //호스트 마이페이지 수정 null 필드는 기존 값 유지.
    @Transactional
    public HostMyPageResponseDto update(Long memberNo,
                                        UpdateHostRequestDto request,
                                        MultipartFile profileImage) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        // 3) 회원 공통 정보 변경 (UserService.update와 동일 패턴)
        if (request.getName() != null && !request.getName().isBlank()) {
            member.changeName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            member.changePhone(request.getPhone());
        }
        //프로필 이미지가 들어왔을 때만 S3 업로드 +URL 교체
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String imgUrl = s3Service.upload(profileImage, "member-profile");
                member.updateImgUrl(imgUrl);
            } catch (IOException e) {
                throw new CustomException(HostErrorCode.HOST_NOT_FOUND);
            }
        }
        // 4) 사업자 정보 변경 (호스트 전용)
        if (request.getBusinessName() != null && !request.getBusinessName().isBlank()) {
            host.changeBusinessName(request.getBusinessName());
        }
        log.info("호스트 마이페이지 수정 완료: memberNo={}", memberNo);

        // 5) 수정된 정보를 응답 DTO로 변환 (조회 DTO 재활용)
        return HostMyPageResponseDto.from(member, host);

    }

    /**
     * 호스트 비밀번호 변경.
     *
     * <p>비밀번호는 HostEntity에 BCrypt 해시로 저장.
     */
    @Transactional
    public void changePassword(Long memberNo, ChangePasswordRequestDto request) {

        // 1) 새 비번 검증
        PasswordValidator.validate(request.getNewPassword());

        // 2) 호스트 조회 (비번은 HostEntity)
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // ★ 이메일 인증 확인 — 본인 이메일(MemberEntity)이 인증 완료 상태여야 함
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        if (!emailService.isVerified(member.getEmail())) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 3) 현재 비번 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), host.getPassword())) {
            throw new CustomException(MemberErrorCode.WRONG_CURRENT_PASSWORD);
        }

        // 4) 새 비번이 기존과 동일한지 검증
        if (passwordEncoder.matches(request.getNewPassword(), host.getPassword())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_PASSWORD);
        }

        // 5) 새 비번 암호화 후 저장
        String encoded = passwordEncoder.encode(request.getNewPassword());
        host.changePassword(encoded);
        log.info("호스트 비밀번호 변경 완료: memberNo={}", memberNo);
    }

    /**
     * 호스트 이메일 변경.
     *
     * <p>이메일은 공통 MemberEntity에 저장되므로 일반회원과 동일 로직.
     * 새 이메일은 (1) 인증 완료 (2) 미사용 조건을 서버에서 재검증.
     * <p>변경 후 프론트는 재로그인 유도 (JWT email claim이 옛 값).
     */
    @Transactional
    public void changeEmail(Long memberNo, ChangeEmailRequestDto request) {
        String newEmail = request.getNewEmail();

        if (newEmail == null || newEmail.isBlank()) {
            throw new IllegalArgumentException("새 이메일을 입력하세요");
        }

        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        if (newEmail.equals(member.getEmail())) {
            throw new CustomException(MemberErrorCode.SAME_AS_OLD_EMAIL);
        }
        if (memberRepository.existsByEmail(newEmail)) {
            throw new CustomException(MemberErrorCode.EMAIL_DUPLICATED);
        }
        if (!emailService.isVerified(newEmail)) {
            throw new CustomException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        member.changeEmail(newEmail);
        log.info("호스트 이메일 변경 완료: memberNo={}", memberNo);
    }

    /**
     * 호스트 본인 신청 현황 조회.
     * 토큰의 memberNo로 본인 Host 조회.
     */
    public HostApplicationResponseDto getMyApplication(Long memberNo) {
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        return HostApplicationResponseDto.from(host);
    }
    /**
     * 호스트 재신청.
     *
     * 반려(R) 상태인 호스트가 사업자 정보·등록증을 보완해 다시 제출.
     * 회원·호스트가 이미 존재하므로 UPDATE로 처리하고, 상태를 R → P로
     * 되돌려 다시 심사 대기로 만든다. (신규 가입 join과 달리 본인 정보 수정에 해당)
     *
     * @param memberNo    로그인한 호스트 본인 (토큰에서 추출 — 클라이언트 입력 불신)
     * @param request     상호명·사업자번호
     * @param businessDoc 새 사업자등록증 파일
     */
    @Transactional
    public void reapply(Long memberNo, HostReapplyRequestDto request, MultipartFile businessDoc) {

        // 1) 본인 호스트 조회
        HostEntity host = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        // 2) 반려(R) 상태에서만 재신청 가능
        if (host.getApprovalState() != ApprovalState.R) {
            throw new CustomException(HostErrorCode.INVALID_APPROVAL_STATE);
        }

        // 3) 필수값 검증
        if (request.getBusinessName() == null || request.getBusinessName().isBlank()) {
            throw new IllegalArgumentException("상호명은 필수입니다");
        }
        if (request.getBusinessNo() == null || request.getBusinessNo().isBlank()) {
            throw new IllegalArgumentException("사업자등록번호는 필수입니다");
        }
        if (businessDoc == null || businessDoc.isEmpty()) {
            throw new IllegalArgumentException("사업자등록증 파일은 필수입니다");
        }

        // 4) 사업자번호 중복 체크 — 본인 건은 제외 (번호를 그대로 유지할 수도 있으니)
        if (hostRepository.existsByBusinessNoAndMemberNoNot(request.getBusinessNo(), memberNo)) {
            throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다");
        }

        // 5) 새 파일 업로드 (검증 통과 후 — S3 쓰레기 방지)
        String businessDocUrl;
        try {
            businessDocUrl = s3Service.upload(businessDoc, "host-business-doc");
        } catch (IOException e) {
            log.error("사업자등록증 재업로드 실패: memberNo={}", memberNo, e);
            throw new IllegalArgumentException("사업자등록증 업로드에 실패했습니다");
        }

        // 6) 정보 수정 + 상태 R→P 전환 (의미 메서드에 위임)
        host.changeBusinessName(request.getBusinessName());
        host.changeBusinessNo(request.getBusinessNo());
        host.changeBusinessDocUrl(businessDocUrl);
        host.reReview();   // R → P + rejectReason 초기화 (재검토와 동일 로직 재활용)

        log.info("호스트 재신청 접수: memberNo={}, businessNo={}, approvalState=P",
                memberNo, request.getBusinessNo());
    }

    /**
     * 호스트 탈퇴 (soft delete).
     *
     * <p>회원 공통(Member) status=W + delYn='Y'. 호스트도 Member 상속 구조라 동일 처리.
     * 제한 체크(진행중 예약·미정산)는 프론트 선검증 — 발표 단계.
     */
    @Transactional
    public void withdraw(Long memberNo) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));

        member.withdraw(); // status=W, delYn='Y'
    }

}//class
