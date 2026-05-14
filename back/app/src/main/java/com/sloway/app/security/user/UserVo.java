package com.sloway.app.security.user;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserVo {

    private Long memberNo;
    private String password;
    private String email;
    private String authType;
    private String role;

}
