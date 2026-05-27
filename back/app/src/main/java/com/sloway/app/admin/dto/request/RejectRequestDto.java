package com.sloway.app.admin.dto.request;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 호스트 신청 반려 사유 입력 DTO.
 *
 * <p>승인은 URL의 {id}만으로 충분하지만, 반려는 사유가 필수.
 * 사유는 호스트에게 노출되므로 반드시 받아 저장한다.
 *
 * <p>※ HostEntity에 rejectReason 컬럼이 아직 없음 — 블록 4에서 추가 결정.
 */
@Getter
@Setter
@NoArgsConstructor
public class RejectRequestDto {

    /** 반려 사유 (호스트에게 노출됨) */
    private String reason;
}