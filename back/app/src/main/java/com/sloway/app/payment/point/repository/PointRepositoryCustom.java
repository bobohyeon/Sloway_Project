package com.sloway.app.payment.point.repository;

import com.sloway.app.payment.point.common.PointStatus;

// TODO: 학원 BoardRepositoryCustom 참고
//       - 인터페이스라 메서드 시그니처만 선언
//       - 본체는 PointRepositoryImpl 에서 implements
public interface PointRepositoryCustom {

    // TODO: 회원별 amount SUM 메서드 시그니처
    //       - 메서드명 예: sumByMemberAndStatus
    //       - 파라미터: Long memberNo, PointStatus status
    //         (status 파라미터로 받으면 호출부에서 SAVE / WAIT 선택 가능)
    //       - 반환 타입: Integer (amount 합산)
    //       - import 영역: com.sloway.app.payment.point.common.PointStatus

    Integer sumByMemberAndStatus(Long memberNo, PointStatus status);

}
