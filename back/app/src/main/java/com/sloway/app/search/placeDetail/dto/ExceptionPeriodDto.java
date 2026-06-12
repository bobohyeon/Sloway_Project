package com.sloway.app.search.placeDetail.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;


@Getter
@AllArgsConstructor
public class ExceptionPeriodDto {

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer monPrice;
    private Integer tuePrice;
    private Integer wedPrice;
    private Integer thuPrice;
    private Integer friPrice;
    private Integer satPrice;
    private Integer sunPrice;
    private Integer holPrice;

}
