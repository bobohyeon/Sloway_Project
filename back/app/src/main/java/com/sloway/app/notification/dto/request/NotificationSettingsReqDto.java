package com.sloway.app.notification.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class NotificationSettingsReqDto {

    private Map<String, ChannelDto> settings;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ChannelDto {
        private boolean push;
    }

    public Map<String, Boolean> toPushMap() {
        Map<String, Boolean> map = new HashMap<>();
        if (settings != null) {
            settings.forEach((k, v) -> map.put(k, v.isPush()));
        }
        return map;
    }
}
