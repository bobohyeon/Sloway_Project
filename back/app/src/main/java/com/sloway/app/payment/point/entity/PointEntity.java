package com.sloway.app.payment.point.entity;

import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "POINT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PointEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column
    private Long memberNo;

    @Column
    private Long payNo;

    @Column
    private Integer amount;

    @Column
    @Enumerated(EnumType.STRING)
    private PointDealType dealType;

    @Column
    private LocalDateTime expiredAt;

    @Column
    private LocalDateTime expiration;

    @Column
    @Enumerated(EnumType.STRING)
    private PointStatus status;

    // TODO: confirmEarn() — 적립 확정 (이용 완료 + 7일 후 호출 예정)
    public void confirmEarn() {
        if (this.status != PointStatus.WAIT) {
            throw new IllegalStateException("적립 대기상태에서만 적립확정 가능");
        }
        this.status = PointStatus.SAVE;

    }

    public void expire() {
        if (this.status != PointStatus.WAIT && this.status != PointStatus.SAVE) {
            throw new IllegalStateException("WAIT 또는 EARN 상태만 만료 가능합니다.");
        }
        this.status = PointStatus.EXPIRATION;
    }

    public void cancel() {
        if (this.status != PointStatus.WAIT && this.status != PointStatus.SAVE) {
            throw new IllegalStateException("WAIT 또는 EARN 상태만 취소 가능합니다.");
        }
        this.status = PointStatus.CANCEL;
    }

    // TODO: (선택) use() — 적립 row 자체를 USED로 전환할지 결정 필요
    //       두 가지 접근:
    //         A. 거래 내역 모델 (권장 / 본인이 골격에 적어둔 방식):
    //            → 이 메서드 안 만듦.
    //            → Service에서 새 USE row(dealType=USE, amount 음수)를 INSERT.
    //            → 부분 사용·여러 적립 row 소진 가능, 잔액은 SUM 쿼리로 계산.
    //         B. 적립 row를 통째로 USED 전환:
    //            → 한 번에 한 적립 row만 사용. 부분 사용 불가.
    //            → 만들 경우:
    //                 전이: EARN → USED
    //                 ① 가드: this.status != PointStatus.EARN 이면 예외
    //                 ② this.status = PointStatus.USED;
    //                 ③ (선택) usedAt 필드 추가 후 LocalDateTime.now() 세팅

}
