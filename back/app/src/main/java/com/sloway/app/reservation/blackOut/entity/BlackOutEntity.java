package com.sloway.app.reservation.blackOut.entity;

import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Table(name = "BLACK_OUT")
@Entity
public class BlackOutEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "office_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private OfficeEntity officeNo;

    @JoinColumn(name = "station_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private StationEntity stationNo;

    @JoinColumn(name = "work_stay_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private WorkStayEntity workStayNo;

    @Column(nullable = false, length = 100, name = "title")
    private String title;

    @Column(columnDefinition = "TEXT", name = "memo")
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false, name = "reason_type")
    private BlackOutReasonType reasonType;

    @Column(nullable = false, name = "start_date")
    private LocalDateTime startDate;

    @Column(nullable = false, name = "end_date")
    private LocalDateTime endDate;

    @Column(nullable = false, name = "start_time")
    private LocalDateTime startTime;

    @Column(nullable = false, name = "end_time")
    private LocalDateTime endTime;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
    }

    public void editBlackOut(String title, String memo, BlackOutReasonType reasonType,
                             LocalDateTime startDate, LocalDateTime endDate,
                             LocalDateTime startTime, LocalDateTime endTime) {
        this.title = title;
        this.memo = memo;
        this.reasonType = reasonType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}
