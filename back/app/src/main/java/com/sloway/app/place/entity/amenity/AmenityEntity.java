package com.sloway.app.place.entity.amenity;

import com.sloway.app.place.dto.request.amenity.AmenityReqDto;
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

    @Column(length = 30, nullable = true)
    private String name;

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String commonYn = "N";

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String workStayYn = "N";

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String officeYn = "N";

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String stationYn = "N";

    @Column(length = 1 , nullable = false)
    @Builder.Default
    protected String delYn = "N";

    public void deleteAmenity(Long no){
        this.delYn = "N".equals(this.delYn) ? "Y" : "N";
    }

    public void updateAmenity(AmenityReqDto entity){
        this.name = entity.getName();
        this.commonYn = entity.getCommonYn();
        this.stationYn = entity.getStationYn();
        this.officeYn = entity.getOfficeYn();
        this.workStayYn = entity.getWorkStayYn();
    }
}
