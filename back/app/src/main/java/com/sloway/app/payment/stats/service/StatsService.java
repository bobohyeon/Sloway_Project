package com.sloway.app.payment.stats.service;

import com.querydsl.core.Tuple;
import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.payment.stats.dto.response.*;
import com.sloway.app.payment.stats.entity.DailyPayStatsEntity;
import com.sloway.app.payment.stats.entity.DailyRefundStatsEntity;
import com.sloway.app.payment.stats.repository.DailyPayStatsRepository;
import com.sloway.app.payment.stats.repository.DailyRefundStatsRepository;
import com.sloway.app.payment.stats.repository.StatsRepositoryCustom;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.ToLongBiFunction;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final PayRepository payRepository;
    private final RefundRepository refundRepository;
    private final DailyPayStatsRepository dailyPayStatsRepository;
    private final DailyRefundStatsRepository dailyRefundStatsRepository;
    private final HostPlaceRepository hostPlaceRepository;
    private final StatsRepositoryCustom statsRepositoryCustom;
    private final HostRepository hostRepository;

    // 일자별 통계를 사전집계 테이블에 적재 — 조회마다 결제 원장을 집계하면 비싸서 하루치를 미리 적재(스케줄러가 자정 호출)
    @Transactional
    public void loadDailyStats(LocalDate targetDate) {
        LocalDateTime startTime = targetDate.atStartOfDay();
        LocalDateTime endTime = targetDate.atTime(23, 59, 59);
        List<Tuple> list = payRepository.sumByMethodBetween(startTime, endTime);
        for (Tuple tuple : list) {
            PayMethod payMethod = tuple.get(0, PayMethod.class);
            Long count = tuple.get(1, Long.class);
            Long sum = tuple.get(2, Long.class);
            // 같은 (일자, 결제수단) 행이 있으면 update, 없으면 insert → 재적재돼도 멱등(upsert)
            dailyPayStatsRepository
                    .findByStatDateAndPayMethod(targetDate,
                            payMethod)
                    .ifPresentOrElse(
                            entity ->
                                    entity.updateStats(count.intValue(), sum),
                            () -> dailyPayStatsRepository.save(
                                    DailyPayStatsEntity.builder()
                                            .statDate(targetDate)
                                            .payMethod(payMethod)
                                            .payCount(count.intValue())
                                            .totalAmt(sum)
                                            .build()
                            )
                    );
        }
        Tuple refundTuple = refundRepository.sumBetween(startTime,
                endTime);
        Long refundCount = refundTuple.get(0, Long.class);
        BigDecimal refundAmt = refundTuple.get(1, BigDecimal.class);
        dailyRefundStatsRepository.findByStatDate(targetDate)
                .ifPresentOrElse(
                        entity ->
                                entity.updateStats(refundCount.intValue(), refundAmt),
                        () -> dailyRefundStatsRepository.save(
                                DailyRefundStatsEntity.builder()
                                        .statDate(targetDate)

                                        .refundCount(refundCount.intValue())
                                        .refundAmt(refundAmt)
                                        .build()
                        )
                );
    }

    public MonthlySalesResDto findStatsMonthlySales(int year, int month, int months) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.minusMonths(months - 1).atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<DailyPayStatsEntity> payRows = dailyPayStatsRepository.findByStatDateBetween(start, end);
        long totalAmt = payRows.stream().mapToLong(e -> e.getTotalAmt()).sum();
        long payCount = payRows.stream().mapToLong(e -> e.getPayCount()).sum();

        long refundAmt = dailyRefundStatsRepository.findByStatDateBetween(start, end).stream()
                .map(DailyRefundStatsEntity::getRefundAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .longValue();

        return MonthlySalesResDto.of(ym.toString(), totalAmt, payCount, refundAmt);
    }


    public List<PayMethodStatResDto> findStatsPayMethods(int year, int month, int months) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.minusMonths(months - 1).atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<DailyPayStatsEntity> payRows = dailyPayStatsRepository.findByStatDateBetween(start, end);
        return payRows.stream()
                .collect(Collectors.groupingBy(DailyPayStatsEntity::getPayMethod))
                .entrySet().stream()
                .map(entry -> {
                    PayMethod method = entry.getKey();
                    List<DailyPayStatsEntity> rows = entry.getValue();
                    int count = rows.stream().mapToInt(DailyPayStatsEntity::getPayCount).sum();
                    long amt = rows.stream().mapToLong(e -> e.getTotalAmt()).sum();
                    return PayMethodStatResDto.of(method, count, amt);
                })
                .toList();
    }


    public List<MonthlyTrendResDto> findStatsMonthlyTrend(int year, int month, int months) {
        YearMonth base = YearMonth.of(year, month);
        List<MonthlyTrendResDto> result = new ArrayList<>();
        for (int i = months - 1; i >= 0; i--) {
            YearMonth ym = base.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            long totalAmt = dailyPayStatsRepository.findByStatDateBetween(start, end).stream()
                    .mapToLong(e -> e.getTotalAmt())
                    .sum();
            result.add(MonthlyTrendResDto.of(ym.toString(), totalAmt));
        }
        return result;
    }


    public RefundStatResDto findStatsRefund(int year, int month, int months) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.minusMonths(months - 1).atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<DailyRefundStatsEntity> refundRows = dailyRefundStatsRepository.findByStatDateBetween(start, end);
        int refundCount = refundRows.stream().mapToInt(DailyRefundStatsEntity::getRefundCount).sum();
        BigDecimal refundAmt = refundRows.stream()
                .map(DailyRefundStatsEntity::getRefundAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long finalAmt = dailyPayStatsRepository.findByStatDateBetween(start, end).stream()
                .mapToLong(e -> e.getTotalAmt())
                .sum();
        return RefundStatResDto.of(refundCount, refundAmt, finalAmt);
    }

    public HostSalesStatsResDto findHostSalesStats(Long memberNo, int year, int month, int months) {

        HostEntity hostEntity = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        List<HostPlaceEntity> hostPlaces =
                hostPlaceRepository.findByHostEntityNoAndStatus(hostEntity.getNo(), ApprovalStatus.A);

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

        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.minusMonths(months - 1).atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        long officeAmt = payRepository.sumByOfficeIn(officeNos, start, end);
        long stationAmt = payRepository.sumByStationIn(stationNos, start, end);
        long workStayAmt = payRepository.sumByWorkStayIn(workStayNos, start, end);
        long totalAmt = officeAmt + stationAmt + workStayAmt;

        long refundAmt = refundRepository.sumByOfficeIn(officeNos, start, end)
                .add(refundRepository.sumByStationIn(stationNos, start, end))
                .add(refundRepository.sumByWorkStayIn(workStayNos, start, end))
                .longValue();

        Long payCount = payRepository.sumSalesStatsByOfficeIn(officeNos, start, end)
                + payRepository.sumSalesStatsByStationIn(stationNos, start, end)
                + payRepository.sumSalesStatsByWorkStayIn(workStayNos, start, end);

        Map<String, Long> monthlySales = payRepository
                .sumByMonthBetween(officeNos, stationNos, workStayNos, start, end)
                .stream()
                .collect(Collectors.toMap(
                        m -> m.getMonth(),
                        m -> {
                            Long v = m.getSum();
                            return v == null ? 0L : v;
                        }));
        List<MonthlyTrendResDto> trend = buildTrend(ym, months,
                (s, e) -> monthlySales.getOrDefault(YearMonth.from(s).toString(), 0L));

        return HostSalesStatsResDto.of(totalAmt, payCount, refundAmt, trend);
    }

    public HostSalesStatsResDto findHostSalesStatsForAdmin(Long hostNo, int year, int month, int months) {
        HostEntity hostEntity = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        return findHostSalesStats(hostEntity.getMemberNo(), year, month, months);
    }

    public SpaceStatsResDto findSpaceStats(int year, int month, int months) {

        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.minusMonths(months - 1).atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        Long active = statsRepositoryCustom.countHostPlaceByStatus(ApprovalStatus.A);
        Long pending = statsRepositoryCustom.countHostPlaceByStatus(ApprovalStatus.P);
        Long newReg = statsRepositoryCustom.countHostPlaceByCreatedAtBetween(start, end);
        Long officeCount = statsRepositoryCustom.countHostPlaceByOffice();
        Long stationCount = statsRepositoryCustom.countHostPlaceByStation();
        Long workStayCount = statsRepositoryCustom.countHostPlaceByWorkStay();
        Long total = officeCount + stationCount + workStayCount;

        SpaceTypeCountResDto officeResDto = SpaceTypeCountResDto.of("office", officeCount);
        SpaceTypeCountResDto stationResDto = SpaceTypeCountResDto.of("station", stationCount);
        SpaceTypeCountResDto workStayResDto = SpaceTypeCountResDto.of("workStay",workStayCount);

        List<SpaceTypeCountResDto> byType = List.of(officeResDto, stationResDto, workStayResDto);
        return SpaceStatsResDto.of(total, newReg, active, pending, byType);
    }

    public BookingStatsResDto findBookingStats(int year, int month, int months) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.minusMonths(months - 1).atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        Map<RsvnStatus, Long> counts = statsRepositoryCustom.countRsvnGroupByStatus(start, end);
        long confirmed = counts.getOrDefault(RsvnStatus.S, 0L);
        long complete = counts.getOrDefault(RsvnStatus.E, 0L);
        long cancel = counts.getOrDefault(RsvnStatus.C, 0L);
        long total = counts.values().stream().mapToLong(Long::longValue).sum();

        List<MonthlyTrendResDto> trend = buildTrend(ym, months, (s, e)
                -> statsRepositoryCustom.countRsvnByCreatedAtBetween(s, e));
        return BookingStatsResDto.of(total, confirmed, cancel, complete, trend);
    }

    public MemberStatsResDto findMemberStats(int year, int month, int months) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.minusMonths(months - 1).atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        Long total = statsRepositoryCustom.countMember();
        Long active = statsRepositoryCustom.countMemberByStatus(MemberStatus.A);
        Long withdrawn = statsRepositoryCustom.countMemberByStatus(MemberStatus.W);
        Long newSignup = statsRepositoryCustom.countMemberByCreatedAtBetween(start, end);

        List<MonthlyTrendResDto> trend = buildTrend(ym, months, (s, e)
                -> statsRepositoryCustom.countMemberByCreatedAtBetween(s, e));
        return MemberStatsResDto.of(total, newSignup, active, withdrawn, trend);

    }

    private List<MonthlyTrendResDto> buildTrend(YearMonth base, int months, ToLongBiFunction<LocalDateTime, LocalDateTime> valueFn) {
        List<MonthlyTrendResDto> trend = new ArrayList<>();
        for (int i = months - 1; i >= 0; i--) {
            YearMonth ymMinus = base.minusMonths(i);
            LocalDateTime mStart = ymMinus.atDay(1).atStartOfDay();
            LocalDateTime mEnd = ymMinus.atEndOfMonth().atTime(23, 59, 59);
            long mTotal = valueFn.applyAsLong(mStart, mEnd);
            trend.add(MonthlyTrendResDto.of(ymMinus.toString(), mTotal));
        }
        return trend;
    }

}
