package com.sloway.app.place.entity.hostPlace;

import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "HOST_PLACE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class HostPlaceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACE_NO", nullable = true)
    private PlaceEntity placeEntity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_NO", nullable = true)
    private WorkStayEntity workStayEntity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OFFICE_NO", nullable = true)
    private OfficeEntity officeEntity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STATION_NO", nullable = true)
    private StationEntity stationEntity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "HOST_NO", nullable = false)
    private HostEntity hostEntity;

    @Column(nullable = true)
    private LocalDateTime approvalDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(1)", nullable = false)
    @Builder.Default
    private ApprovalStatus status = ApprovalStatus.P;

    @Column(columnDefinition = "TEXT")
    private String rejectedReason;

    @Column(nullable = false , updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
    }

    public void approve() {
        this.status = ApprovalStatus.A;
        this.approvalDate = LocalDateTime.now();
    }

    public void reject(String rejectedReason) {
        this.status = ApprovalStatus.R;
        this.rejectedReason = rejectedReason;
    }
}
