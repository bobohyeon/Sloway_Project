package com.sloway.app.payment.settlement.settle.scheduler;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.dto.request.SettleCreateReqDto;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import com.sloway.app.payment.settlement.settle.repository.SettleRepository;
import com.sloway.app.payment.settlement.settle.service.SettleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class SettleScheduler {

    private final SettleService settleService;
    private final HostRepository hostRepository;
    private final SettleRepository settleRepository;

    @Scheduled(cron = "0 0 0 */4 * *")
    public void settleBatch() {
        LocalDate end = LocalDate.now().minusDays(1);
        LocalDate start = end.minusDays(3);

        for (HostEntity host : hostRepository.findAll()) {
            try {
                SettleCreateReqDto reqDto = SettleCreateReqDto.builder()
                        .hostNo(host.getNo())
                        .settleStartDate(start)
                        .settleEndDate(end)
                        .build();
                settleService.createSettle(reqDto);
            } catch (Exception e) {
                log.error("정산 배치 실패 hostNo={}", host.getNo(), e);
            }
        }
    }

    @Scheduled(cron = "0 0 0 */4 * *")
    public void invoiceBatch() {
        for (SettleEntity settle : settleRepository.findByStatus(SettleStatus.COMPLETE)) {
            try {
                settleService.issueTaxInvoice(settle.getNo());
            } catch (Exception e) {
                log.error("세금계산서 발행 실패 settleNo={}", settle.getNo(), e);
            }
        }
    }

}
