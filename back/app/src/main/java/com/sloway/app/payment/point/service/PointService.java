package com.sloway.app.payment.point.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.common.MemberErrorCode;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointErrorCode;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.dto.request.PointSaveReqDto;
import com.sloway.app.payment.point.dto.request.PointUseReqDto;
import com.sloway.app.payment.point.dto.response.PointBalanceResDto;
import com.sloway.app.payment.point.dto.response.PointResDto;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PointService {

    private final PointRepository pointRepository;
    private final PayRepository payRepository;
    private final MemberRepository memberRepository;

    public List<PointResDto> findPointAll() {
        return pointRepository.findAll().stream().map(PointResDto::from).toList();
    }

    public PointResDto findPointByNo(Long no) {
        return PointResDto.from(findPoint(no));
    }

    public List<PointResDto> findPointsByMemberNo(Long memberNo) {
        findMember(memberNo);
        List<PointEntity> entityList = pointRepository.findPointsByMemberNo(memberNo);
        return entityList.stream().map(PointResDto::from).toList();
    }

    @Transactional
    public PointResDto savePoint(PointSaveReqDto pointSaveReqDto) {
        PayEntity payEntity = findPay(pointSaveReqDto.getPayNo());
        MemberEntity memberEntity = findMember(pointSaveReqDto.getMemberNo());

        int amount = (int) (payEntity.getFinalAmt() * 0.01);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);
        PointEntity entity = pointSaveReqDto.toEntity(payEntity, memberEntity);
        entity.applySaveAmount(amount, expiredAt);
        return PointResDto.from(pointRepository.save(entity));
    }

    @Transactional
    public PointResDto usePoint(PointUseReqDto pointSaveReqDto) {

        PayEntity payEntity = findPay(pointSaveReqDto.getPayNo());
        MemberEntity memberEntity = findMember(pointSaveReqDto.getMemberNo());

        if (pointSaveReqDto.getAmount() < 1000) {
            throw new CustomException(PointErrorCode.POINT_BELOW_MIN);
        }
        if (pointSaveReqDto.getAmount() > payEntity.getFinalAmt() * 30 / 100) {
            throw new CustomException(PointErrorCode.POINT_EXCEED_LIMIT);
        }
        // 보유 잔액 검증 — usePointInternal과 동일 정책(잔액 부족 시 마이너스 row 방지)
        int currentPoint = calcBalance(pointSaveReqDto.getMemberNo());
        if (currentPoint < pointSaveReqDto.getAmount()) {
            throw new CustomException(PointErrorCode.POINT_INSUFFICIENT);
        }
        PointEntity entity = pointSaveReqDto.toEntity(payEntity, memberEntity);
        entity.applyUseAmount(-pointSaveReqDto.getAmount());
        return PointResDto.from(pointRepository.save(entity));
    }

    @Transactional
    public PointResDto expirePoint(Long no) {
        PointEntity pointEntity = findPoint(no);
        pointEntity.expire();
        return PointResDto.from(pointEntity);
    }

    @Transactional
    public PointResDto confirmEarnPoint(Long no) {
        PointEntity pointEntity = findPoint(no);
        pointEntity.confirmEarn();
        return PointResDto.from(pointEntity);
    }


    // 포인트 사용 정책 검증 — 최소(1,000)·한도(기준액 30%)·보유 잔액.
    // 결제 ready 단계 사전검증과 approve 단계 실제 차감 양쪽에서 공통 사용(승인 후 한도초과로 터지는 것 방지)
    public void validatePointUsage(Long memberNo, int amount, int basisAmt) {
        if (amount < 1000) {
            throw new CustomException(PointErrorCode.POINT_BELOW_MIN);
        }
        int pointLimit = (basisAmt * 30) / 100;
        if (amount > pointLimit) {
            throw new CustomException(PointErrorCode.POINT_EXCEED_LIMIT);
        }
        if (calcBalance(memberNo) < amount) {
            throw new CustomException(PointErrorCode.POINT_INSUFFICIENT);
        }
    }

    @Transactional
    public void usePointInternal(Long memberNo, Integer amount, PayEntity payEntity) {
        int dcAmtSafe = payEntity.getDcAmt() == null ? 0 : payEntity.getDcAmt();
        int basisAmt = payEntity.getBaseAmt() + payEntity.getAddAmt() - dcAmtSafe;
        validatePointUsage(memberNo, amount, basisAmt);
        MemberEntity memberEntity = findMember(memberNo);
        PointEntity entity = PointEntity.builder()
                .memberNo(memberEntity)
                .payNo(payEntity)
                .amount(-amount)
                .dealType(PointDealType.USE)
                .status(PointStatus.USED)
                .expiredAt(null)
                .build();
        pointRepository.save(entity);
    }


    @Transactional
    public void earnPointInternal(Long memberNo, PayEntity payEntity) {
        int savePoint = (int) (payEntity.getFinalAmt() * 0.01);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);
        MemberEntity memberEntity = findMember(memberNo);

        PointEntity pointEntity = PointEntity.builder()
                .memberNo(memberEntity)
                .payNo(payEntity)
                .amount(savePoint)
                .dealType(PointDealType.EARN)
                .expiredAt(expiredAt)
                .status(PointStatus.WAIT)
                .build();
        pointRepository.save(pointEntity);
    }

    @Transactional
    public void earnSignupPoint(Long memberNo){
        MemberEntity memberEntity = findMember(memberNo);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);
        PointEntity pointEntity = PointEntity.builder()
                .memberNo(memberEntity)
                .amount(5000)
                .dealType(PointDealType.EARN)
                .expiredAt(expiredAt)
                .status(PointStatus.SAVE)
                .build();
        pointRepository.save(pointEntity);
    }

    public PointBalanceResDto findPointBalanceByMemberNo(Long memberNo) {
        MemberEntity memberEntity = findMember(memberNo);
        int balance = calcBalance(memberNo);
        return PointBalanceResDto.from(memberEntity, balance);
    }

    // 포인트 잔액 = 적립 + 사용 합산
    private int calcBalance(Long memberNo) {
        int saveSum = pointRepository.sumByMemberAndStatus(memberNo, PointStatus.SAVE);
        int usedSum = pointRepository.sumByMemberAndStatus(memberNo, PointStatus.USED);
        return saveSum + usedSum;
    }

    // 환불 시 사용했던 포인트를 되돌림
    @Transactional
    public void refundUsedPoint(PayEntity payEntity) {
        MemberEntity member = findMember(payEntity.getRsvnNo().getMemberNo().getNo());
        List<PointEntity> pointList = pointRepository.findByPayAndDealType(payEntity.getNo(), PointDealType.USE);
        int sumPoint = pointList.stream().mapToInt(PointEntity::getAmount).sum();
        int returnPoint = Math.abs(sumPoint);
        if (returnPoint == 0) return;
        PointEntity entity = PointEntity.builder()
                .memberNo(member)
                .payNo(payEntity)
                .amount(returnPoint)
                .dealType(PointDealType.EARN)
                .status(PointStatus.SAVE)
                .expiredAt(LocalDateTime.now().plusYears(1))
                .build();
        pointRepository.save(entity);
    }

    // 환불 시 그 결제로 적립됐던 포인트를 취소
    @Transactional
    public void cancelEarnedPoint(PayEntity payEntity) {
        List<PointEntity> pointList = pointRepository.findByPayAndDealType(payEntity.getNo(), PointDealType.EARN);
        pointList.stream()
                .filter(p -> p.getStatus() == PointStatus.WAIT || p.getStatus() == PointStatus.SAVE)
                .forEach(PointEntity::cancel);
    }

    // 유효기간 지난 보유 포인트(WAIT/SAVE)를 EXPIRATION으로 전이 → calcBalance에서 자동 제외
    @Transactional
    public void expirePointsScheduled() {
        List<PointEntity> expiredList = pointRepository.findExpiredHoldingPoints(LocalDateTime.now());
        expiredList.forEach(PointEntity::expire);
    }

    @Transactional
    public void confirmEarnPointsScheduled() {
        // 정책: 이용 완료(체크아웃) 시 적립 확정 — 별도 대기 기간 없음.
        // 체크아웃 후에는 환불 경로가 없어(취소=ALREADY_COMPLETED, 환불=DDAY 차단) 대기 버퍼 불필요.
        List<PointEntity> pointEntityList = pointRepository.findExpiredWaitForEarn(LocalDateTime.now());
        pointEntityList.stream()
                .filter(p -> p.getStatus() == PointStatus.WAIT)
                .forEach(PointEntity::confirmEarn);


    }

    private MemberEntity findMember(Long memberNo) {
        return memberRepository.findById(memberNo)
                .orElseThrow(() -> new CustomException(MemberErrorCode.MEMBER_NOT_FOUND));
    }

    private PointEntity findPoint(Long pointNo) {
        return pointRepository.findById(pointNo)
                .orElseThrow(() -> new CustomException(PointErrorCode.POINT_NOT_FOUND));
    }

    private PayEntity findPay(Long payNo) {
        return payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
    }


}