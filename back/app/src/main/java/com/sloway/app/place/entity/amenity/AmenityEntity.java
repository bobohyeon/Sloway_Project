package com.sloway.app.place.entity.amenity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "AMENITY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AmenityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(length = 30, nullable = false)
    private String name;

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String commonYn = "N";

    @Column(length = 1 , nullable = false)
    protected String workStayYn = "N";

    @Column(length = 1 , nullable = false)
    protected String officeYn = "N";

    @Column(length = 1 , nullable = false)
    protected String stationYn = "N";

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String delYn = "N";

    public void deleteAmenity(Long no){
        this.delYn = "N".equals(this.delYn) ? "Y" : "N";
    }
}
