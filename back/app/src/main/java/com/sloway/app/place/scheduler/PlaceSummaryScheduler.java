package com.sloway.app.place.scheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlaceSummaryScheduler {
    private final JdbcTemplate jdbcTemplate;

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void refreshPlaceSummary() {
        jdbcTemplate.execute("TRUNCATE TABLE place_summary");

        String sql = """
            INSERT INTO place_summary (
                place_no, type, target_no, title, address, current_url, price, 
                final_score, rsvn_count, avg_score, amenities, status, updated_at
            )
            WITH RsvnStats AS (
                        SELECT
                            p.no as place_no,
                            p.type,
                            COUNT(DISTINCT r.no) AS rsvn_cnt,
                            AVG(rev.score_total) AS avg_score
                        FROM place p
                        -- 1. 각각의 상세 테이블을 먼저 조인하여 PK(no)를 맞춤
                        LEFT JOIN station s ON p.type = 'STATION' AND s.place_no = p.no
                        LEFT JOIN office o ON p.type = 'OFFICE' AND o.place_no = p.no
                        LEFT JOIN work_stay w ON p.type = 'WORK_STAY' AND w.place_no = p.no
                
                        -- 2. 이제 상세 테이블의 PK와 rsvn의 FK를 비교
                        LEFT JOIN rsvn r ON (
                            (p.type = 'STATION' AND r.station_no = s.no) OR
                            (p.type = 'OFFICE' AND r.office_no = o.no) OR
                            (p.type = 'WORK_STAY' AND r.work_stay_no = w.no)
                        )
                        LEFT JOIN review rev ON rev.rsvn_no = r.no
                        GROUP BY p.no, p.type
                    )
            SELECT 
                p.no, p.type,
                CASE WHEN p.type = 'STATION' THEN s.no WHEN p.type = 'OFFICE' THEN o.no ELSE w.no END,
                p.title || ' ' || COALESCE(s.title, o.title, w.title),
                p.address, i.current_url,
                COALESCE(s.mon_price, 
                         (SELECT MIN(op.price) FROM office_period op WHERE op.office_no = o.no AND op.exception_start_date IS NULL), 
                         w.mon_price, 0),
                ROUND(CASE WHEN COALESCE(rs.rsvn_cnt, 0) = 0 THEN 0.0 ELSE ((rs.rsvn_cnt * 0.7) + (rs.avg_score * 0.3)) * 100 END)::int,
                COALESCE(rs.rsvn_cnt, 0),
                COALESCE(rs.avg_score, 0.0),
                amenity_agg.names,
                p.status, NOW()
            FROM place p
            LEFT JOIN station s ON s.place_no = p.no
            LEFT JOIN office o ON o.place_no = p.no
            LEFT JOIN work_stay w ON w.place_no = p.no
            LEFT JOIN RsvnStats rs ON rs.place_no = p.no AND rs.type = p.type
            LEFT JOIN img_place i ON i.place_no = p.no AND i.sort = 1
            LEFT JOIN (
                SELECT wa.work_no, STRING_AGG(a.name, ',') as names
                FROM work_amenity wa JOIN amenity a ON a.no = wa.amenity_no GROUP BY wa.work_no
            ) amenity_agg ON amenity_agg.work_no = w.no
            WHERE p.status = 'I'
        """;
        jdbcTemplate.update(sql);
    }
}