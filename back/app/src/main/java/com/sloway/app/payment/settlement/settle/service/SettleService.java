package com.sloway.app.payment.settlement.settle.service;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.payment.settlement.fee.common.PlaceType;
import com.sloway.app.payment.settlement.fee.repository.FeeRepository;
import com.sloway.app.payment.settlement.settle.dto.request.SettleCreateReqDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleResDto;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import com.sloway.app.payment.settlement.settle.repository.SettleRepository;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class SettleService {

    private final SettleRepository settleRepository;
    private final HostRepository hostRepository;
    private final PayRepository payRepository;
    private final RefundRepository refundRepository;
    private final FeeRepository feeRepository;
    private final HostPlaceRepository hostPlaceRepository;

    @Transactional
    public SettleResDto createSettle(SettleCreateReqDto reqDto) {
        HostEntity host = hostRepository.findById(reqDto.getHostNo())
                .orElseThrow(() -> new EntityNotFoundException("호스트 정보를 조회할 수 없습니다."));

        List<HostPlaceEntity> hostPlaces =
                hostPlaceRepository.findByHostEntityNoAndStatus(host.getNo(), ApprovalStatus.A);

        List<Long> officeNos = hostPlaces.stream()
                .filter(hp -> hp.getOfficeEntity() != null)
                .map(hp -> hp.getOfficeEntity().getNo())
                .toList();

        List<Long> stationNos = hostPlaces.stream()
                .filter(hp -> hp.getStationEntity() != null)
                .map(hp -> hp.getStationEntity().getNo())
                .toList();

        List<Long> workStayNos = hostPlaces.stream()
                .filter(hp -> hp.getWorkStayEntity() != null)
                .map(hp -> hp.getWorkStayEntity().getNo())
                .toList();

        LocalDateTime start = reqDto.getSettleStartDate().atStartOfDay();
        LocalDateTime end = reqDto.getSettleEndDate().atTime(LocalTime.MAX);

        int officeAmt = payRepository.sumByOfficeIn(officeNos, start, end);
        int stationAmt = payRepository.sumByStationIn(stationNos, start, end);
        int workStayAmt = payRepository.sumByWorkStayIn(workStayNos, start, end);
        int totalAmt = officeAmt + stationAmt + workStayAmt;

        int feeAmt = calcFee(officeAmt, PlaceType.office)
                + calcFee(stationAmt, PlaceType.station)
                + calcFee(workStayAmt, PlaceType.workStay);

        int refundAmt = refundRepository.sumByOfficeIn(officeNos, start, end)
                .add(refundRepository.sumByStationIn(stationNos, start, end))
                .add(refundRepository.sumByWorkStayIn(workStayNos, start, end))
                .intValue();

        int payoutAmt = totalAmt - feeAmt - refundAmt;

        // ─────────────────────────────────────────────────────────────
        // TODO: carry-over (최소 정산 기준 미달 시 다음 회차 이월) — B 방식 (carryOver 필드)
        //   1. 이 host 의 직전 정산 조회 → 직전 carryOver 가져오기 (없으면 0)
        //      (SettleRepositoryCustom 에 추가할 직전 조회 메서드 사용)
        //   2. 실효 정산액 = 이번 payoutAmt + 직전 carryOver
        //   3. 실효 정산액이 최소 기준(MIN_PAYOUT, 상수) 이상인지 판정
        //        - 이상 → 지급: 지급액 = 실효, carryOver = 0, status = WAITING
        //        - 미달 → 이월: 지급액 = 0, carryOver = 실효, status = CARRIED
        //   4. entity 에 carryOver 와 status 까지 반영 (applyAmounts 확장 or 별도 Rich)
        //   ※ MIN_PAYOUT 은 private static final int 상수로 (예: 10000)
        //
        //   ⚠️ 함정 — 바로 아래 0원 스킵 가드와 충돌:
        //     매출 0 이어도 직전 carryOver 가 남아있으면 이월을 계속 굴려야 한다.
        //     지금처럼 totalAmt == 0 이면 무조건 return null 하면 이월이 끊긴다.
        //     → "totalAmt == 0 AND 직전 carryOver == 0" 일 때만 스킵하도록 조건을 좁힐지 검토.
        // ─────────────────────────────────────────────────────────────

        if (totalAmt == 0) {
            return null;
        }

        SettleEntity entity = reqDto.toEntity(host);
        entity.applyAmounts(totalAmt, feeAmt, refundAmt, payoutAmt);
        return SettleResDto.from(settleRepository.save(entity));
    }

    private int calcFee(int amt, PlaceType placeType) {
        if (amt == 0) return 0;
        int rate = feeRepository.findByPlaceTypeAndDelYn(placeType, "N")
                .orElseThrow(() -> new EntityNotFoundException(placeType + " 수수료 정책이 없습니다."))
                .getRate();
        return amt * rate / 100;
    }


    public List<SettleResDto> findSettleAll() {
        return settleRepository.findAll().stream().map(SettleResDto::from).toList();
    }

    public SettleResDto findSettleByNo(Long no) {
        SettleEntity entity = settleRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("정산 정보를 조회할 수 없습니다."));
        return SettleResDto.from(entity);
    }


    @Transactional
    public SettleResDto completeSettle(Long no) {
        SettleEntity entity = settleRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("조회 할 수 없습니다."));
        entity.completeSettle();
        return SettleResDto.from(entity);
    }

    @Transactional
    public SettleResDto issueTaxInvoice(Long no) {
        SettleEntity entity = settleRepository.findById(no)
                .orElseThrow(() -> new EntityNotFoundException("조회 할 수 없습니다."));
        entity.issueTaxInvoice();   // 이미 SettleEntity에 있는 Rich
        return SettleResDto.from(entity);
    }

}
