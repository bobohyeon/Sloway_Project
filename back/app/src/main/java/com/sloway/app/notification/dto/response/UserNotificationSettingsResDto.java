package com.sloway.app.notification.dto.response;

import com.sloway.app.notification.entity.UserNotificationSettingsEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public class UserNotificationSettingsResDto {

    private Map<String, ChannelDto> settings;

    @Getter
    @AllArgsConstructor
    public static class ChannelDto {
        private boolean push;
    }

    public static UserNotificationSettingsResDto from(UserNotificationSettingsEntity e) {
        Map<String, ChannelDto> map = new LinkedHashMap<>();
        map.put("reviewRequest", new ChannelDto(e.isReviewRequest()));
        map.put("reviewReply", new ChannelDto(e.isReviewReply()));
        map.put("chatMessage", new ChannelDto(e.isChatMessage()));
        map.put("inquiryReply", new ChannelDto(e.isInquiryReply()));
        map.put("pointSaved", new ChannelDto(e.isPointSaved()));
        map.put("newCoupon", new ChannelDto(e.isNewCoupon()));
        map.put("couponExpiry", new ChannelDto(e.isCouponExpiry()));
        map.put("eventNews", new ChannelDto(e.isEventNews()));
        return new UserNotificationSettingsResDto(map);
    }
}
