package com.sloway.app.payment.pay.pg.kakao;

import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoApproveReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoCancelReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoReadyReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoApproveResDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoCancelResDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoReadyResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class KakaoPayClient {

    private final RestTemplate restTemplate;

    @Value("${kakao.pay.secret-key}")
    private String secretKey;

    @Value("${kakao.pay.base-url}")
    private String baseUrl;

    @Value("${kakao.pay.cid}")
    private String cid;


    public KakaoReadyResDto ready(KakaoReadyReqDto reqDto) {
        reqDto = reqDto.toBuilder().cid(this.cid).build();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<KakaoReadyReqDto> entity = new HttpEntity<>(reqDto, headers);

        return restTemplate.postForObject(baseUrl + "/payment/ready", entity, KakaoReadyResDto.class);
    }

    public KakaoApproveResDto approve(KakaoApproveReqDto reqDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<KakaoApproveReqDto> entity = new HttpEntity<>(reqDto, headers);

        return restTemplate.postForObject(baseUrl + "/payment/approve", entity, KakaoApproveResDto.class);
    }

    public KakaoCancelResDto cancel(KakaoCancelReqDto reqDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<KakaoCancelReqDto> entity = new HttpEntity<>(reqDto, headers);

        return restTemplate.postForObject(baseUrl + "/payment/cancel", entity, KakaoCancelResDto.class);
    }


}
