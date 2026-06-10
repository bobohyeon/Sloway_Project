package com.sloway.app.payment.settlement.settle.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.payment.settlement.fee.common.FeeErrorCode;
import com.sloway.app.payment.settlement.fee.common.PlaceType;
import com.sloway.app.payment.settlement.fee.repository.FeeRepository;
import com.sloway.app.payment.settlement.settle.common.SettleErrorCode;
import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.dto.request.SettleCreateReqDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleResDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleStatsResDto;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import com.sloway.app.payment.settlement.settle.repository.SettleRepository;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    private static final int MIN_PAYOUT = 10000;

    // 정산 생성
    @Transactional
    public SettleResDto createSettle(SettleCreateReqDto reqDto) {
        HostEntity host = hostRepository.findById(reqDto.getHostNo())
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        List<HostPlaceEntity> hostPlaces =
                hostPlaceRepository.findByHostEntityNoAndStatus(host.getNo(), ApprovalStatus.A);
        List<Long> officeNos = hostPlaces.stream()
                .filter(hp -> hp.getOfficeEntity() != null)
                .map(hp -> hp.getOfficeEntity().getNo())
                .distinct()
                .toList();
        List<Long> stationNos = hostPlaces.stream()
                .filter(hp -> hp.getStationEntity() != null)
                .map(hp -> hp.getStationEntity().getNo())
                .distinct()
                .toList();
        List<Long> workStayNos = hostPlaces.stream()
                .filter(hp -> hp.getWorkStayEntity() != null)
                .map(hp -> hp.getWorkStayEntity().getNo())
                .distinct()
                .toList();
        LocalDateTime start = reqDto.getSettleStartDate().atStartOfDay();
        LocalDateTime end = reqDto.getSettleEndDate().atTime(LocalTime.MAX);
        // 정산 대상(이용 완료)을 공간 타입별로 합산
        int officeAmt = payRepository.sumByOfficeIn(officeNos, start, end).intValue();
        int stationAmt = payRepository.sumByStationIn(stationNos, start, end).intValue();
        int workStayAmt = payRepository.sumByWorkStayIn(workStayNos, start, end).intValue();
        int totalAmt = officeAmt + stationAmt + workStayAmt;
        // 공간 타입별 수수료율을 적용해 수수료 합산
        int feeAmt = calcFee(officeAmt, PlaceType.office,start)
                + calcFee(stationAmt, PlaceType.station,start)
                + calcFee(workStayAmt, PlaceType.workStay,start);
        int refundAmt = refundRepository.sumByOfficeIn(officeNos, start, end)
                .add(refundRepository.sumByStationIn(stationNos, start, end))
                .add(refundRepository.sumByWorkStayIn(workStayNos, start, end))
                .intValue();
        int payoutAmt = totalAmt - feeAmt - refundAmt;   // 결제액에서 수수료·환불액을 뺀 실지급액
        Integer prevCarryOver = settleRepository.findLatestByHostNo(host.getNo())
                .map(SettleEntity::getCarryOver).orElse(0);
        int effectiveAmt = payoutAmt + prevCarryOver;
        if (totalAmt == 0 && prevCarryOver == 0) {
            return null;
        }
        SettleEntity entity = reqDto.toEntity(host);
        entity.applyAmounts(totalAmt, feeAmt, refundAmt, payoutAmt);
        entity.settleWithCarry(effectiveAmt, MIN_PAYOUT);
        return SettleResDto.from(settleRepository.save(entity));   // 정산 데이터 저장
    }

    // 공간 타입별 수수료율을 결제액에 적용
    private int calcFee(int amt, PlaceType placeType,LocalDateTime date) {
                if (amt == 0) return 0;
        int rate = feeRepository.findValidFee(placeType, date)
                .orElseThrow(() -> new CustomException(FeeErrorCode.FEE_NOT_FOUND))
                .getRate();
        return amt * rate / 100;
    }

    public Page<SettleResDto> findSettleAll(int pno, String tab) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return settleRepository.findSettleAll(pageRequest,toStatus(tab));
    }

    public SettleStatsResDto findSettleStats(){
        return settleRepository.findSettleStats();
    }

    private SettleStatus toStatus(String tab){
        if(tab == null) return null;
        return switch (tab){
            case "WAITING" -> SettleStatus.WAITING;
            case "COMPLETE" -> SettleStatus.COMPLETE;
            case "INVOICE" -> SettleStatus.INVOICE;
            default -> null;
        };
    }

    public List<SettleResDto> findSettleByHostNo(Long memberNo) {
        HostEntity hostEntity = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        List<SettleEntity> entityList = settleRepository.findByHostNo(hostEntity.getNo());
        return entityList.stream().map(SettleResDto::from).toList();
    }

    public List<SettleResDto> findSettleByHostNoForAdmin(Long hostNo) {
        return settleRepository.findByHostNo(hostNo).stream().map(SettleResDto::from).toList();
    }

    public SettleResDto findSettleByNo(Long no) {
        SettleEntity entity = findSettleEntity(no);
        return SettleResDto.from(entity);
    }

    @Transactional
    public SettleResDto completeSettle(Long no) {
        SettleEntity entity = findSettleEntity(no);
        entity.completeSettle();
        return SettleResDto.from(entity);
    }

    @Transactional
    public SettleResDto issueTaxInvoice(Long no) {
        SettleEntity entity = findSettleEntity(no);
        entity.issueTaxInvoice();
        return SettleResDto.from(entity);
    }

    private SettleEntity findSettleEntity(Long no){
        return settleRepository.findById(no)
                .orElseThrow(() -> new CustomException(SettleErrorCode.SETTLE_NOT_FOUND));
    }


}
