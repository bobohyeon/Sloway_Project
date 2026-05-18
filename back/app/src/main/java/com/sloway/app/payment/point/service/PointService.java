package com.sloway.app.payment.point.service;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.dto.request.PointSaveReqDto;
import com.sloway.app.payment.point.dto.request.PointUseReqDto;
import com.sloway.app.payment.point.dto.response.PointResDto;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.repository.PointRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

// TODO: 포인트 서비스
//       메서드 컨벤션: createPoint / findPointAll / findPointById
//       부가 메서드: savePoint(적립), usePoint(사용), expirePoint(만료)
//       정책 검증:
//         - 사용 시 최소 1,000P 검증
//         - 사용 시 결제액의 30% 초과 검증
//         - 적립은 결제 완료 + 7일 후 확정 (@Scheduled 활용 가능)
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
        PointEntity pointEntity = pointRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("포인트 정보를 조회할 수 없습니다."));

        return PointResDto.from(pointEntity);
    }

    @Transactional
    public PointResDto savePoint(PointSaveReqDto reqDto) {
        PayEntity payEntity = payRepository.findById(reqDto.getPayNo())
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 조회할 수 없습니다."));

        MemberEntity memberEntity = memberRepository.findById(reqDto.getMemberNo())
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 조회할 수 없습니다."));

        int amount = (int) (payEntity.getFinalAmt() * 0.01);
        LocalDateTime expiredAt = LocalDateTime.now().plusYears(1);

        PointEntity entity = reqDto.toEntity(payEntity, memberEntity);
        entity.applySaveAmount(amount, expiredAt);

        return PointResDto.from(pointRepository.save(entity));
    }


    // TODO: usePoint(...) — 사용 (정책 검증 후 음수 row 생성, 거래 내역 모델)
    @Transactional
    public PointResDto usePoint(PointUseReqDto reqDto) {
        // TODO: 1) PayEntity 조회 (savePoint 와 동일 패턴)
        //       PayEntity pay = payRepository.findById(reqDto.getPayNo())
        //               .orElseThrow(() -> new EntityNotFoundException("결제 정보를 조회할 수 없습니다."));

        // TODO: 2) MemberEntity 조회

        // TODO: 3) 정책 검증 — 위반 시 throw new IllegalArgumentException("...")
        //       (a) 최소 1,000P:
        //             if (reqDto.getAmount() < 1000) throw ...
        //       (b) 결제액 30% 한도 — 정수 연산 사용:
        //             if (reqDto.getAmount() > pay.getFinalAmt() * 30 / 100) throw ...
        //             ※ 0.3 (double) 이 아니라 30 / 100 으로 정수 나눗셈
        //       (c) 잔액 검증 — Level 1 보류 (pointRepository SUM 쿼리 필요)

        // TODO: 4) toEntity(pay, member) 호출 → PointEntity entity
        //       PointUseReqDto.toEntity 에서 dealType=USE / status=USED 강제 박힘

        // TODO: 5) Rich 메서드로 음수 amount 박기 (PointEntity 에 applyUseAmount 메서드 추가 필요)
        //       entity.applyUseAmount(-reqDto.getAmount());
        //       ※ applySaveAmount 와 동일 결의 Rich 메서드. 가드는 본인 결정.

        // TODO: 6) pointRepository.save(entity) 후 ResDto 반환
        //       return PointResDto.from(pointRepository.save(entity));

        return null; // TODO: 위 단계 완료 후 실제 ResDto 반환
    }

    // TODO: Rich()  — 유효기간 계산
}
