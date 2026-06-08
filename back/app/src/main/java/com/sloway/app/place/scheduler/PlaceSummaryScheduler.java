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

    @Scheduled(cron = "0 */10 * * * *") // 10분마다 실행
    @Transactional
    public void refreshPlaceSummary() {
        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY place_summary");
//        jdbcTemplate.execute("TRUNCATE TABLE place_summary");
//
//        String sql = """
//                   INSERT INTO place_summary (
//                               place_no, type, target_no, title, address, current_url, price,
//                               final_score, rsvn_count, avg_score, amenities, status, updated_at
//                           )
//                           WITH
//                           RsvnStats AS (
//                                SELECT
//                                    p.no as place_no,
//                                    p.type,
//                                    COUNT(DISTINCT r.no) AS rsvn_cnt,
//                                    AVG(rev.score_total) AS avg_score
//                                FROM place p
//                                LEFT JOIN station s
//                                    ON p.type = 'STATION' AND s.place_no = p.no
//                                LEFT JOIN office o
//                                    ON p.type = 'OFFICE' AND o.place_no = p.no
//                                LEFT JOIN work_stay w
//                                    ON p.type = 'WORK_STAY' AND w.place_no = p.no
//                                LEFT JOIN rsvn r
//                                    ON (
//                                        (p.type = 'STATION' AND r.station_no = s.no)
//                                        OR (p.type = 'OFFICE' AND r.office_no = o.no)
//                                        OR (p.type = 'WORK_STAY' AND r.work_stay_no = w.no)
//                                    )
//                                LEFT JOIN review rev
//                                    ON rev.rsvn_no = r.no
//                                GROUP BY p.no, p.type
//                           ),
//                           ImgInfo AS (
//                                SELECT
//                                    DISTINCT ON (place_no) place_no,
//                                    current_url
//                                FROM img_place
//                                WHERE sort = 1
//                           ),
//                           AmenityInfo AS (
//                                SELECT
//                                    wa.work_no,
//                                    STRING_AGG(a.name, ',') as names
//                                FROM work_amenity wa
//                                    JOIN amenity a
//                                        ON a.no = wa.amenity_no
//                                GROUP BY wa.work_no
//                           )
//                           SELECT
//                               p.no, p.type,
//                               MAX(CASE WHEN p.type = 'STATION' THEN s.no WHEN p.type = 'OFFICE' THEN o.no ELSE w.no END) as target_no,
//                               MAX(p.title || ' ' || COALESCE(s.title, o.title, w.title)) as title,
//                               MAX(p.address) as address,
//                               MAX(i.current_url) as current_url,
//                               MAX(COALESCE(s.mon_price,
//                                            (SELECT MIN(op.price) FROM office_period op WHERE op.office_no = o.no AND op.exception_start_date IS NULL),
//                                            w.mon_price, 0)) as price,
//                               MAX(ROUND(CASE WHEN COALESCE(rs.rsvn_cnt, 0) = 0 THEN 0.0 ELSE ((rs.rsvn_cnt * 0.7) + (rs.avg_score * 0.3)) * 100 END)::int) as final_score,
//                               MAX(COALESCE(rs.rsvn_cnt, 0)) as rsvn_count,
//                               MAX(COALESCE(rs.avg_score, 0.0)) as avg_score,
//                               MAX(am.names) as amenities,
//                               MAX(p.status) as status,
//                               NOW() as updated_at
//                           FROM place p
//                           LEFT JOIN station s ON p.type = 'STATION' AND s.place_no = p.no
//                           LEFT JOIN office o ON p.type = 'OFFICE' AND o.place_no = p.no
//                           LEFT JOIN work_stay w ON p.type = 'WORK_STAY' AND w.place_no = p.no
//                           LEFT JOIN RsvnStats rs ON rs.place_no = p.no AND rs.type = p.type
//                           LEFT JOIN ImgInfo i ON i.place_no = p.no
//                           LEFT JOIN AmenityInfo am ON am.work_no = w.no
//                           WHERE p.status = 'I'
//                           GROUP BY p.no, p.type
//                           ON CONFLICT (place_no, type)
//                               DO UPDATE SET
//                                   target_no = EXCLUDED.target_no,
//                                   title = EXCLUDED.title,
//                                   address = EXCLUDED.address,
//                                   current_url = EXCLUDED.current_url,
//                                   price = EXCLUDED.price,
//                                   final_score = EXCLUDED.final_score,
//                                   rsvn_count = EXCLUDED.rsvn_count,
//                                   avg_score = EXCLUDED.avg_score,
//                                   amenities = EXCLUDED.amenities,
//                                   status = EXCLUDED.status,
//                                   updated_at = EXCLUDED.updated_at;
//                """;
//        jdbcTemplate.update(sql);
    }
}