package com.sloway.app.payment.pay.pg.toss.client;

import com.sloway.app.payment.pay.pg.toss.dto.request.TossConfirmReqDto;
import com.sloway.app.payment.pay.pg.toss.dto.response.TossConfirmResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

// 토스페이먼츠 연동 클라이언트 — 카카오와 달리 서버측은 confirm 1단계
// 카카오 ready/approve 2단계 대신, 프론트 SDK가 결제창을 열고 성공하면 서버가 confirm으로 최종 승인만 함
@Component
@RequiredArgsConstructor
@Slf4j
public class TossPayClient {

    private final RestTemplate restTemplate; // PgRestTemplateConfig의 공용 Bean 재사용 (카카오와 공유)

    @Value("${toss.pay.secret-key}")
    private String secretKey;

    @Value("${toss.pay.base-url}")
    private String baseUrl;

    // 결제 승인: paymentKey/orderId/amount를 토스에 보내 결제를 최종 확정
    public TossConfirmResDto confirm(TossConfirmReqDto reqDto) {
        HttpHeaders headers = new HttpHeaders();
        // 토스 인증: Authorization: Basic base64(secretKey + ":")
        // setBasicAuth(user, pass)가 "user:pass"를 base64로 자동 인코딩 → 비밀번호 빈 값("")으로 콜론만 붙는 효과
        headers.setBasicAuth(secretKey, "");
        headers.setContentType(MediaType.APPLICATION_JSON); // 카카오(form)와 달리 JSON 전송

        HttpEntity<TossConfirmReqDto> entity = new HttpEntity<>(reqDto, headers);

        // 성공 시 200 OK + Payment 객체. 실패 시 4xx/5xx → RestTemplate이 HttpStatusCodeException 던짐
        // (예외 변환은 Service 계층에서 try-catch로 PayErrorCode 매핑 — 다음 단계에서 처리)
        return restTemplate.postForObject(baseUrl + "/v1/payments/confirm", entity, TossConfirmResDto.class);
    }

    // 결제 취소: paymentKey로 토스에 취소 요청. 카카오 cancel과 짝 — 환불 시 method 보고 분기 호출
    // cancelAmount 지정 시 부분취소, null이면 전액취소(환불율 적용된 부분환불 대응)
    public void cancel(String paymentKey, String cancelReason, Integer cancelAmount) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(secretKey, ""); // confirm과 동일한 Basic 인증
        headers.setContentType(MediaType.APPLICATION_JSON);

        // cancelReason 필수 + cancelAmount 있으면 부분취소(없으면 전액)
        Map<String, Object> body = new HashMap<>();
        body.put("cancelReason", cancelReason);
        if (cancelAmount != null) {
            body.put("cancelAmount", cancelAmount);
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // POST /v1/payments/{paymentKey}/cancel — paymentKey 는 PayEntity.tid 에 저장된 값
        restTemplate.postForObject(baseUrl + "/v1/payments/" + paymentKey + "/cancel", entity, TossConfirmResDto.class);
    }
}
