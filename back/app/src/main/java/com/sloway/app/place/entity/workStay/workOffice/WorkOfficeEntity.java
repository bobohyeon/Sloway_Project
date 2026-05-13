package com.sloway.app.place.entity.workStay.workOffice;

import com.sloway.app.place.entity.workStay.WorkStayEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "WORK_STAY_OFFICE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class WorkOfficeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORK_NO", nullable = false)
    private WorkStayEntity workStayEntity;
}
