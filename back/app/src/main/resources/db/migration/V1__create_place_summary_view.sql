-- 기존에 테이블이 있다면 삭제
DROP TABLE IF EXISTS place_summary;
-- 기존에 존재하는 Materialized view 삭제
DROP MATERIALIZED VIEW IF EXISTS place_summary;

-- Materialized View 생성
CREATE MATERIALIZED VIEW place_summary AS

WITH RsvnStats AS (
    SELECT
        p.no as place_no,
        p.type,
        s.no as station_no,
        o.no as office_no,
        w.no as work_stay_no,
        COUNT(DISTINCT r.no) AS rsvn_cnt,
        AVG(rev.score_total) AS avg_score
    FROM place p
    LEFT JOIN station s ON p.type = 'STATION' AND s.place_no = p.no
    LEFT JOIN office o ON p.type = 'OFFICE' AND o.place_no = p.no
    LEFT JOIN work_stay w ON p.type = 'WORK_STAY' AND w.place_no = p.no
    LEFT JOIN rsvn r ON (
        (p.type = 'STATION' AND r.station_no = s.no)
        OR (p.type = 'OFFICE' AND r.office_no = o.no)
        OR (p.type = 'WORK_STAY' AND r.work_stay_no = w.no)
        AND r.status = 'S'
    )
        INNER JOIN rsvn rcnt ON r.no = rcnt.no AND rcnt.status = 'S'
    LEFT JOIN review rev ON rev.rsvn_no = r.no
    GROUP BY p.no, p.type, s.no, o.no, w.no
),
ImgInfo AS (
    SELECT DISTINCT ON (place_no) place_no, current_url
    FROM img_place
    WHERE sort = 1
    ORDER BY place_no
),
AmenityInfo AS (
    SELECT wa.work_no, STRING_AGG(a.name, ',') as names
    FROM work_amenity wa
    JOIN amenity a ON a.no = wa.amenity_no
    GROUP BY wa.work_no
),
OfficeMinPrice AS (
    SELECT office_no, MIN(price) as min_price
    FROM office_period
    WHERE exception_start_date IS NULL
    GROUP BY office_no
)
SELECT
    p.no as place_no,
    p.type,
    MAX(
            CASE
                WHEN p.type = 'STATION' THEN s.no
                WHEN p.type = 'OFFICE' THEN o.no
                ELSE w.no
                END
    ) as target_no,
    MAX(p.title || ' ' || COALESCE(s.title, o.title, w.title)) as title,
    MAX(p.address) as address,
    MAX(i.current_url) as current_url,
    MAX(COALESCE(s.mon_price, op.min_price, w.mon_price, 0)) as price,
    MAX(
            ROUND(
                    CASE
                        WHEN COALESCE(rs.rsvn_cnt, 0) = 0 THEN 0.0
                        ELSE ((rs.rsvn_cnt * 0.7) + (COALESCE(rs.avg_score, 0.0) * 0.3)) * 100
                        END
                        +
                    CASE
                        WHEN p.created_at >= NOW() - INTERVAL '7 days' THEN 50
                        ELSE 0
                        END
            )::int
    ) as final_score,
    MAX(COALESCE(rs.rsvn_cnt, 0)) as rsvn_count,
    MAX(COALESCE(rs.avg_score, 0.0)) as avg_score,
    MAX(am.names) as amenities,
    MAX(p.status) as status,
    NOW() as updated_at
FROM place p
         LEFT JOIN station s
                   ON p.type = 'STATION'
                       AND s.place_no = p.no
         LEFT JOIN office o
                   ON p.type = 'OFFICE'
                       AND o.place_no = p.no
         LEFT JOIN work_stay w
                   ON p.type = 'WORK_STAY'
                       AND w.place_no = p.no
         LEFT JOIN RsvnStats rs
                   ON rs.place_no = p.no
                       AND rs.type = p.type
                       AND (
                          (p.type = 'STATION' AND rs.station_no = s.no)
                              OR (p.type = 'OFFICE' AND rs.office_no = o.no)
                              OR (p.type = 'WORK_STAY' AND rs.work_stay_no = w.no)
                          )
         LEFT JOIN ImgInfo i ON i.place_no = p.no
         LEFT JOIN AmenityInfo am ON am.work_no = w.no
         LEFT JOIN OfficeMinPrice op ON op.office_no = o.no
WHERE p.status = 'I'
GROUP BY p.no, p.type, s.no, o.no, w.no;
-- REFRESH CONCURRENTLY를 위한 인덱스 생성
CREATE UNIQUE INDEX idx_place_summary_unique ON place_summary (place_no, type, target_no);
