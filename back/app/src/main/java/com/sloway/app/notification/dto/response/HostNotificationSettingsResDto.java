package com.sloway.app.notification.dto.response;

import com.sloway.app.notification.entity.HostNotificationSettingsEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public class HostNotificationSettingsResDto {

    private Map<String, ChannelDto> settings;

    @Getter
    @AllArgsConstructor
    public static class ChannelDto {
        private boolean push;
    }

    public static HostNotificationSettingsResDto from(HostNotificationSettingsEntity e) {
        Map<String, ChannelDto> map = new LinkedHashMap<>();
        map.put("settlementSchedule", new ChannelDto(e.isSettlementSchedule()));
        map.put("settlementComplete", new ChannelDto(e.isSettlementComplete()));
        map.put("taxInvoice", new ChannelDto(e.isTaxInvoice()));
        map.put("chatMessage", new ChannelDto(e.isChatMessage()));
        map.put("newReview", new ChannelDto(e.isNewReview()));
        map.put("lowRatingAlert", new ChannelDto(e.isLowRatingAlert()));
        return new HostNotificationSettingsResDto(map);
    }
}
