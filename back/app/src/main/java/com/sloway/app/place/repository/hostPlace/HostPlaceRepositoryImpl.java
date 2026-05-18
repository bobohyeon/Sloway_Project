package com.sloway.app.place.repository.hostPlace;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import static com.sloway.app.host.entity.QHostEntity.hostEntity;
import static com.sloway.app.place.entity.place.QPlaceEntity.placeEntity;
import static com.sloway.app.place.entity.workStay.QWorkStayEntity.workStayEntity;
import static com.sloway.app.place.entity.office.QOfficeEntity.officeEntity;
import static com.sloway.app.place.entity.office.QOfficePeriodEntity.officePeriodEntity;
import static com.sloway.app.place.entity.station.QStationEntity.stationEntity;
import static com.sloway.app.place.entity.hostPlace.QHostPlaceEntity.hostPlaceEntity;

@RequiredArgsConstructor
public class HostPlaceRepositoryImpl implements HostPlaceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<HostPlaceListRespDto> findHostPlaceList() {
        List<Tuple> results = queryFactory
                .select(
                        hostPlaceEntity.no,
                        placeEntity.title,
                        hostEntity.businessName,
                        hostPlaceEntity.status,
                        hostPlaceEntity.createdAt,
                        workStayEntity.monPrice,
                        stationEntity.monPrice,
                        ExpressionUtils.as(
                                JPAExpressions
                                        .select(officePeriodEntity.price.min())
                                        .from(officePeriodEntity)
                                        .where(officePeriodEntity.officeEntity.eq(officeEntity)),
                                "minOfficePrice"
                        )
                )
                .from(hostPlaceEntity)
                .join(hostPlaceEntity.hostEntity, hostEntity)
                .join(hostPlaceEntity.placeEntity, placeEntity)
                .leftJoin(workStayEntity).on(workStayEntity.placeEntity.eq(placeEntity))
                .leftJoin(officeEntity).on(officeEntity.placeEntity.eq(placeEntity))
                .leftJoin(stationEntity).on(stationEntity.placeEntity.eq(placeEntity))
                .fetch();

        return results.stream().map(tuple -> {
            String type = "P";
            String price = "0";

            if (tuple.get(workStayEntity.monPrice) != null) {
                type = "W";
                price = String.valueOf(tuple.get(workStayEntity.monPrice)); // 예시: 월요일 요금
            } else if (tuple.get(officeEntity.cnt) != null) {
                type = "C";
                price = "오피스 가격 정책 적용";
            } else if (tuple.get(stationEntity.monPrice) != null) {
                type = "S";
                price = String.valueOf(tuple.get(stationEntity.monPrice));
            }

            String formattedDate = tuple.get(hostPlaceEntity.createdAt) != null
                    ? tuple.get(hostPlaceEntity.createdAt).toLocalDate().toString() : "";

            return HostPlaceListRespDto.builder()
                    .no(tuple.get(hostPlaceEntity.no))
                    .name(tuple.get(placeEntity.title))
                    .host(tuple.get(hostEntity.businessName))
                    .status(tuple.get(hostPlaceEntity.status.stringValue()))
                    .type(type)
                    .price(price)
                    .date(formattedDate)
                    .build();
        }).collect(Collectors.toList());
    }
}