package com.sloway.app.payment.settlement.account.entity;


import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.host.entity.HostEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ACCOUNT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class AccountEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @JoinColumn(name = "HOST_NO", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private HostEntity hostNo;

    @Column
    private String bankName;

    @Column
    private String accountNo;

    @Column
    private String holder;

    public void updateAccount(String bankName, String accountNo, String holder) {
        this.bankName = bankName;
        this.accountNo = accountNo;
        this.holder = holder;
    }


}
