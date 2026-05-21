package com.sloway.app.reservation.rsvn.entity;

import com.sloway.app.member.entity.MemberEntity;
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
@Table(name = "RSVN")
@Entity
public class RsvnEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "member_no", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberNo;

    @JoinColumn(name = "office_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private OfficeEntity officeNo;

    @JoinColumn(name = "station_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private StationEntity stationNo;

    @JoinColumn(name = "work_stay_no")
    @ManyToOne(fetch = FetchType.LAZY)
    private WorkStayEntity workStayNo;

    @Column(nullable = false, name = "count")
    private Integer count;

    @Column(nullable = false, name = "amt")
    private Integer amt;

    @Column(columnDefinition = "TEXT", name = "special")
    private String special;

    @Column(nullable = false, name = "check_in")
    private LocalDateTime checkIn;

    @Column(nullable = false, name = "check_out")
    private LocalDateTime checkOut;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)", nullable = false, name = "status")
    private RsvnStatus status;

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
        this.status = RsvnStatus.S;
    }

    public void cancel(){
        this.status = RsvnStatus.C;
    }

    public void reject(){this.status = RsvnStatus.R;}


}
