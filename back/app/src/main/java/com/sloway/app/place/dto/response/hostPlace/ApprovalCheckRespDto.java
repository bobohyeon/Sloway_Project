package com.sloway.app.place.dto.response.hostPlace;

import lombok.*;
import org.springframework.transaction.annotation.Transactional;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApprovalCheckRespDto {

    private String reason;

}
