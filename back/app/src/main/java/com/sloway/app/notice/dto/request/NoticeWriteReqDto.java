package com.sloway.app.notice.dto.request;

import com.sloway.app.admin.entity.AdminEntity;
import com.sloway.app.notice.entity.NoticeEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeWriteReqDto {

    private String title;
    private String content;

    public NoticeEntity toEntity(){
        return NoticeEntity.builder()
                .title(title)
                .content(content)
//                .writer(adminEntity)
                .build()
                ;
    }
}
