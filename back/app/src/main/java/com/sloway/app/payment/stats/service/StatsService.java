package com.sloway.app.payment.stats.service;

import com.querydsl.core.Tuple;
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

    @Transactional
    public void loadDailyStats(LocalDate targetDate) {
        LocalDateTime startTime = targetDate.atStartOfDay();
        LocalDateTime endTime = targetDate.atTime(23, 59, 59);
        List<Tuple> list = payRepository.sumByMethodBetween(startTime, endTime);

        for (Tuple tuple : list) {
            PayMethod payMethod = tuple.get(0, PayMethod.class);
            Long count = tuple.get(1, Long.class);
            Integer sum = tuple.get(2, Integer.class);
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

    public MonthlySalesResDto findStatsMonthlySales(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();

        List<DailyPayStatsEntity> payRows = dailyPayStatsRepository.findByStatDateBetween(start, end);
        int totalAmt = payRows.stream().mapToInt(DailyPayStatsEntity::getTotalAmt).sum();
        long payCount = payRows.stream().mapToInt(DailyPayStatsEntity::getPayCount).sum();

        int refundAmt = dailyRefundStatsRepository.findByStatDateBetween(start, end).stream()
                .map(DailyRefundStatsEntity::getRefundAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .intValue();

        return MonthlySalesResDto.of(ym.toString(), totalAmt, payCount, refundAmt);
    }


    public List<PayMethodStatResDto> findStatsPayMethods(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();

        List<DailyPayStatsEntity> payRows = dailyPayStatsRepository.findByStatDateBetween(start, end);
        return payRows.stream()
                .collect(Collectors.groupingBy(DailyPayStatsEntity::getPayMethod))
                .entrySet().stream()
                .map(entry -> {
                    PayMethod method = entry.getKey();
                    List<DailyPayStatsEntity> rows = entry.getValue();
                    int count = rows.stream().mapToInt(DailyPayStatsEntity::getPayCount).sum();
                    int amt = rows.stream().mapToInt(DailyPayStatsEntity::getTotalAmt).sum();
                    return PayMethodStatResDto.of(method, count, amt);
                })
                .toList();
    }


    public List<MonthlyTrendResDto> findStatsMonthlyTrend(int year, int month) {
        YearMonth base = YearMonth.of(year, month);
        List<MonthlyTrendResDto> result = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = base.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            int totalAmt = dailyPayStatsRepository.findByStatDateBetween(start, end).stream()
                    .mapToInt(DailyPayStatsEntity::getTotalAmt)
                    .sum();
            result.add(MonthlyTrendResDto.of(ym.toString(), totalAmt));
        }
        return result;
    }


    public RefundStatResDto findStatsRefund(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<DailyRefundStatsEntity> refundRows = dailyRefundStatsRepository.findByStatDateBetween(start, end);
        int refundCount = refundRows.stream().mapToInt(DailyRefundStatsEntity::getRefundCount).sum();
        BigDecimal refundAmt = refundRows.stream()
                .map(DailyRefundStatsEntity::getRefundAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int finalAmt = dailyPayStatsRepository.findByStatDateBetween(start, end).stream()
                .mapToInt(DailyPayStatsEntity::getTotalAmt)
                .sum();
        return RefundStatResDto.of(refundCount, refundAmt, finalAmt);
    }

    public HostSalesStatsResDto findHostSalesStats(Long hostNo, int year, int month) {

        List<HostPlaceEntity> hostPlaces =
                hostPlaceRepository.findByHostEntityNoAndStatus(hostNo, ApprovalStatus.A);

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

        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        int officeAmt = payRepository.sumByOfficeIn(officeNos, start, end);
        int stationAmt = payRepository.sumByStationIn(stationNos, start, end);
        int workStayAmt = payRepository.sumByWorkStayIn(workStayNos, start, end);
        int totalAmt = officeAmt + stationAmt + workStayAmt;

        int refundAmt = refundRepository.sumByOfficeIn(officeNos, start, end)
                .add(refundRepository.sumByStationIn(stationNos, start, end))
                .add(refundRepository.sumByWorkStayIn(workStayNos, start, end))
                .intValue();

        Long payCount = payRepository.sumSalesStatsByOfficeIn(officeNos, start, end)
                + payRepository.sumSalesStatsByStationIn(stationNos, start, end)
                + payRepository.sumSalesStatsByWorkStayIn(workStayNos, start, end);

        List<MonthlyTrendResDto> trend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ymMinus = ym.minusMonths(i);
            LocalDateTime mStart = ymMinus.atDay(1).atStartOfDay();
            LocalDateTime mEnd = ymMinus.atEndOfMonth().atTime(23, 59, 59);
            int mTotal = payRepository.sumByOfficeIn(officeNos, mStart, mEnd)
                    + payRepository.sumByStationIn(stationNos, mStart, mEnd)
                    + payRepository.sumByWorkStayIn(workStayNos, mStart, mEnd);
            trend.add(MonthlyTrendResDto.of(ymMinus.toString(), mTotal));
        }
        return HostSalesStatsResDto.of(totalAmt, payCount, refundAmt, trend);
    }

    public SpaceStatsResDto findSpaceStats(int year, int month) {

        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        Long total = statsRepositoryCustom.countHostPlace();
        Long active = statsRepositoryCustom.countHostPlaceByStatus(ApprovalStatus.A);
        Long pending = statsRepositoryCustom.countHostPlaceByStatus(ApprovalStatus.P);
        Long newReg = statsRepositoryCustom.countHostPlaceByCreatedAtBetween(start, end);

        SpaceTypeCountResDto officeResDto = SpaceTypeCountResDto.of("office", statsRepositoryCustom.countHostPlaceByOffice());
        SpaceTypeCountResDto stationResDto = SpaceTypeCountResDto.of("station", statsRepositoryCustom.countHostPlaceByStation());
        SpaceTypeCountResDto workStayResDto = SpaceTypeCountResDto.of("workStay", statsRepositoryCustom.countHostPlaceByWorkStay());

        List<SpaceTypeCountResDto> byType = List.of(officeResDto, stationResDto, workStayResDto);
        return SpaceStatsResDto.of(total, newReg, active, pending, byType);
    }

    public BookingStatsResDto findBookingStats(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        Long total = statsRepositoryCustom.countRsvnByCreatedAtBetween(start, end);
        Long confirmed = statsRepositoryCustom.countRsvnByStatusAndCreatedAtBetween(RsvnStatus.S, start, end);
        Long complete = statsRepositoryCustom.countRsvnByStatusAndCreatedAtBetween(RsvnStatus.E, start, end);
        Long cancel = statsRepositoryCustom.countRsvnByStatusAndCreatedAtBetween(RsvnStatus.C, start, end);

        List<MonthlyTrendResDto> trend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ymMinus = ym.minusMonths(i);
            LocalDateTime mStart = ymMinus.atDay(1).atStartOfDay();
            LocalDateTime mEnd = ymMinus.atEndOfMonth().atTime(23, 59, 59);
            long mTotal = statsRepositoryCustom.countRsvnByCreatedAtBetween(mStart, mEnd);
            trend.add(MonthlyTrendResDto.of(ymMinus.toString(), (int) mTotal));
        }
        return BookingStatsResDto.of(total, confirmed, cancel, complete, trend);
    }

    public MemberStatsResDto findMemberStats(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        Long total = statsRepositoryCustom.countMember();
        Long active = statsRepositoryCustom.countMemberByStatus(MemberStatus.A);
        Long withdrawn = statsRepositoryCustom.countMemberByStatus(MemberStatus.W);
        Long newSignup = statsRepositoryCustom.countMemberByCreatedAtBetween(start, end);

        List<MonthlyTrendResDto> trend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ymMinus = ym.minusMonths(i);
            LocalDateTime mStart = ymMinus.atDay(1).atStartOfDay();
            LocalDateTime mEnd = ymMinus.atEndOfMonth().atTime(23, 59, 59);
            long mTotal = statsRepositoryCustom.countMemberByCreatedAtBetween(mStart, mEnd);
            trend.add(MonthlyTrendResDto.of(ymMinus.toString(), (int) mTotal));
        }
        return MemberStatsResDto.of(total, newSignup, active, withdrawn, trend);

    }

}
