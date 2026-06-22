# Sloway 아키텍처 문서

> 워케이션 숙소·코워킹 예약 플랫폼 | 2조 Chew's
> 이 문서는 프로젝트의 구조·기술 의사결정·도메인별 구현을 정리합니다.
> 각 도메인 상세는 담당자가 직접 작성·검수합니다. (본 초안의 팀원 섹션은 뼈대만 잡아둔 상태)

---

## 1. 프로젝트 개요

일과 여행을 동시에 — 전국 워케이션 공간(숙소 / 워크앤스테이 / 코워킹오피스)을 검색·예약하고,
호스트가 공간을 등록·운영하며, 관리자가 플랫폼을 운영하는 3-역할(USER / HOST / ADMIN) 예약 플랫폼.

---

## 2. 기술 스택

| 구분         | 기술                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| Backend      | Spring Boot, Java 21, Spring Security, Spring Data JPA, QueryDSL                         |
| Database     | PostgreSQL (Flyway 마이그레이션)                                                         |
| 인증         | JWT (jjwt, Access / Refresh), 카카오 OAuth                                               |
| 실시간/외부  | WebSocket(STOMP), AWS S3, Gmail SMTP                                                     |
| Frontend     | React 19, Vite, JavaScript, styled-components, Redux Toolkit, axios, react-router-dom v7 |
| 결제/시각화  | 카카오페이(API 연동), 토스페이먼츠 SDK, chart.js                                         |
| 인프라(예정) | AWS (Route53 · CloudFront · ACM · ALB · EC2 · RDS · S3), GitHub Actions                  |
| 협업         | Git/GitHub (main ← develop ← user/{이름})                                                |

---

## 3. 아키텍처

### 3.1 현재 (로컬 개발 환경)

```
[React (Vite, :5173)]  ──REST/JSON──►  [Spring Boot (:8080)]  ──JPA──►  [PostgreSQL]
        │                                      │
   JWT 토큰 보관                          Spring Security + JWT 인증
   (axios 인터셉터)                       (USER / HOST / ADMIN 3-역할)
```

### 3.2 목표 (AWS 배포 — 전환 예정)

```
                                         ┌─ /*       → S3 (정적 뷰: React 빌드물)
브라우저 → Route53 → CloudFront ─────────┼─ /files/* → S3 (파일 서버: 업로드 이미지)
                      (HTTPS, ACM 인증서)  └─ /api/*   → ALB → EC2 ×3 ─┬→ RDS (PostgreSQL)
                                                                      ├→ S3 (파일 업로드)
                                                                      └→ Redis (도입 검토)
```

- CloudFront 단일 진입점 — 경로(`/*`·`/files/*`·`/api/*`)로 정적·파일·API를 한 도메인에서 분기 → 동일 오리진이라 CORS 불필요
- ACM — HTTPS 인증서를 CloudFront에 적용
- ALB + EC2 ×3 — 로드밸런서로 API 서버 다중화
- RDS — PostgreSQL 매니지드 DB / S3 — 정적 호스팅 + 파일 저장 / Redis — 캐시·세션 등 용도 검토 중
- CI/CD — GitHub Actions 기반 빌드·배포 파이프라인 구축 예정

> AWS 구성과 CI/CD는 전환 예정 단계입니다. 현재 동작 기준은 위 "로컬 개발 환경"입니다.

---

## 4. 팀 구성 & 도메인 분배

| 역할          | 이름   | 담당 도메인                                             |
| ------------- | ------ | ------------------------------------------------------- |
| 조장          | 김우영 | 결제 / 환불 / 정산 / 쿠폰 / 포인트                      |
| 형상관리자    | 김보현 | 예약 / 리뷰 / 지도 / 검색                               |
| DB관리자      | 서현진 | 워케이션 공간 (숙소 / 워크앤스테이 / 코워킹오피스) / 찜 |
| 테스트 담당자 | 추현종 | 문의 / 공지 / FAQ / 챗봇 / 채팅 / 알림                  |
| 일정관리자    | 오준호 | 회원 / 인증                                             |

---

## 5. 프로젝트 구조

```
Sloway_Project/
├── back/app/                  # Spring Boot
│   └── src/main/java/com/sloway/app/
│       ├── auth/              # 인증 인프라 (로그인·JWT·필터·OAuth)   [오준호]
│       ├── member/            # 일반회원 (가입·마이페이지)            [오준호]
│       ├── host/              # 호스트 (가입신청·재신청·마이페이지)    [오준호]
│       ├── admin/             # 관리자 (회원·호스트 관리)             [오준호]
│       ├── sanction/          # 제재 (회원 정지)                      [오준호]
│       ├── payment/           # 결제·환불·정산·쿠폰·포인트            [김우영]
│       ├── reservation/       # 예약                                  [김보현]
│       ├── review/            # 리뷰                                  [김보현]
│       ├── search/            # 검색                                  [김보현]
│       ├── recent/            # 최근 본 항목                          [김보현]
│       ├── place/             # 워케이션 공간 (숙소·워크앤스테이·코워킹) [서현진]
│       ├── inquiry/           # 문의게시판                            [추현종]
│       ├── notice/            # 공지사항                              [추현종]
│       ├── faq/               # FAQ                                   [추현종]
│       ├── chat/              # 1:1 채팅                              [추현종]
│       ├── notification/      # 알림                                  [서현진]
│       ├── common/            # 공통 (BaseEntity·예외처리·유틸)        [공통]
│       └── aws/               # S3 연동                               [공통]
│
└── front/app/src/
    ├── app/                   # 라우팅·레이아웃·store·api
    ├── styles/ · assets/      # 전역 스타일·정적 리소스
    └── features/              # 도메인 기반 폴더
        ├── auth/ · account/                    # 인증·계정              [오준호]
        ├── approval/                           # 공간 검수·편의시설      [서현진]
        ├── place/ · wishList/ · searchPlace/   # 공간·찜·검색           [서현진·김보현]
        ├── rsvn/ · review/                     # 예약·리뷰              [김보현]
        ├── pay/ · pay_shared/ · refund/        # 결제·환불              [김우영]
        ├── coupon/ · couponevent/ · point/     # 쿠폰·포인트            [김우영]
        ├── settlement/ · stats/ · dashboard/   # 정산·통계·대시보드      [김우영]
        ├── inquiry/ · notice/ · faq/           # 문의·공지·FAQ          [추현종]
        ├── chat/ · notification/               # 채팅·알림              [추현종·서현진]
        └── main/                               # 메인·공통 페이지        [공통]
```

> 위 구조는 실제 패키지/폴더 기준입니다. 프론트 일부 폴더(dashboard 등)는 여러 도메인이 함께 쓰므로 담당이 겹칠 수 있습니다.

---

## 6. 백엔드 아키텍처 원칙

### 6.1 계층 구조 (DDD 기반)

```
Controller  →  Service  →  Repository  →  Entity
 (API)        (비즈니스)    (데이터접근)    (도메인모델)
```

- 도메인별로 독립 패키지 구성 → 높은 응집도, 낮은 결합도
- 타 도메인은 직접 수정하지 않고 서비스/인터페이스 호출로만 연동

### 6.2 도메인 패키지 표준

```
{domain}/
├── entity/        엔티티 & 연관 매핑
├── common/        Enum, 도메인별 ErrorCode
├── repository/    Spring Data JPA + QueryDSL(Custom/Impl)
├── service/       비즈니스 로직
├── controller/    REST 엔드포인트
└── dto/
    ├── request/
    └── response/
```

### 6.3 공통 규칙

BaseEntity 상속 — 모든 엔티티는 생성/수정 시각을 자동 기록 (`common/entity/BaseEntity`).

엔티티 설계 — Setter를 두지 않고 의미 있는 메서드(`changePassword`, `approve` 등)로만 상태 변경. 풍부한 도메인 모델 지향.

예외 처리 — 3단 구조로 통합:

- `CustomException` : 비즈니스 예외 공통 타입
- 도메인별 `ErrorCode` (`MemberErrorCode`, `HostErrorCode`, `AdminErrorCode` ...) : 코드·메시지·HTTP 상태 일원화
- `GlobalExceptionHandler` : `@RestControllerAdvice`로 일관된 에러 응답(`ErrorResponseDto`) 반환

트랜잭션 전략

- 조회: `@Transactional(readOnly = true)` — 성능 최적화 (dirty checking 비활성)
- 변경: `@Transactional` — 데이터 정합성 보장
- 주의: 클래스에 `readOnly=true`를 깔면, 쓰기 메서드는 메서드 단위로 `@Transactional`을 반드시 오버라이드. 누락 시 변경이 조용히 무시됨(저장 안 됨).

PATCH 부분 수정 규칙 — `null = 유지`, `빈 문자열 = 제거`로 일관 적용.

---

## 7. 인증 / 보안 (공통)

> 인증 인프라는 회원/인증 도메인(오준호)이 관리하지만, 모든 도메인이 공유하는 규칙이라 별도 정리.

### 7.1 인증 방식

- JWT 기반 Stateless 인증. 세션 미사용(`SessionCreationPolicy.STATELESS`).
- Access / Refresh 토큰 분리 발급. Refresh는 서버(`RefreshToken` 테이블)에서 관리.
- 역할별 로그인 분리: 일반회원 `/api/auth/login`, 호스트 `/api/host/auth/login`, 관리자 `/api/admin/auth/login`.
- 비밀번호는 BCrypt 해시 저장. 평문 저장 금지.

### 7.2 각 도메인이 지켜야 할 규칙

- **인증 주체는 `@AuthenticationPrincipal`로** — 클라이언트가 보낸 memberNo 등을 신뢰하지 말 것. 토큰에서 추출한 값만 사용(서버 서명이라 위·변조 불가).
- **권한 경로 추가는 SecurityConfig 담당자(오준호)에게 요청** — 직접 수정하지 말고 경로/메서드/역할을 전달. Spring Security는 위에서부터 첫 매칭이라 순서가 중요(구체 경로 먼저, 포괄 `/**` 뒤에).
- **민감정보는 `application-secret.properties`로 분리** — SMTP 앱 비밀번호, 외부 API 키 등. Git 커밋 금지.

> 회원/인증 도메인의 구현 상세는 8.5 참고.

---

## 8. 도메인별 상세 (담당자 작성)

> 각 도메인을 동일 양식(주요 엔티티 / 핵심 기능 / 핵심 로직 / 미완성)으로 정리합니다.
> 아래 8.1(회원/인증)은 작성 예시를 겸합니다. 나머지 도메인은 담당자가 같은 양식으로 채워주세요.

### 8.1 회원 / 인증 — 오준호

```
- 주요 엔티티:
  MemberEntity(공통: 이메일·이름·전화·상태, 3역할 공용),
  UserEntity(일반회원 인증: 비번·authType, memberNo FK),
  HostEntity(호스트: 사업자정보·비번·승인상태 ApprovalState),
  RefreshToken, SocialAccount(카카오)
- 핵심 기능:
  3역할 로그인(일반/호스트/관리자) · JWT(Access/Refresh) · 카카오 OAuth ·
  회원가입(이메일 인증 + 포인트 자동적립) · 마이페이지 · 비밀번호 재설정(SMTP) ·
  호스트 승인 워크플로우(승인/반려/재검토/재신청/회수/복구)
- 핵심 로직:
  호스트 승인 상태 전이 ─ 신청(P) → 승인(A)/반려(R), A→회수(V)→복구(A),
  R→P는 어드민 재검토·호스트 재신청 두 경로가 동일 로직(reReview) 공유.
  이용 제한은 인증이 아닌 서비스 게이트(assertApproved, 승인 A 아니면 403)로 처리.
- 미완성/이관:
  assertApproved를 공간 등록(place) 진입부에서 호출 필요(서현진 협의)
```

### 8.2 결제 / 환불 / 정산 — 김우영

```
- 주요 엔티티:
  PayEntity(결제: rsvn FK·tid·method·finalAmt·status),
  CouponEntity(발급된 쿠폰: member FK·dcType·status) / CouponEventEntity(게시 템플릿: 다운로드 시 CouponEntity 생성),
  PointEntity(적립/사용: dealType EARN·USE, status WAIT→SAVE→USED),
  RefundEntity(환불: pay FK·refundRate·refundAmt BigDecimal),
  SettleEntity(정산: host FK·payout·carryOver·status) / FeeEntity(공간타입별 수수료율),
  DailyPayStats·DailyRefundStats(통계 사전집계 엔티티)
- 핵심 기능:
  결제(카카오페이·토스페이먼츠 외부 PG 연동, 쿠폰·포인트 통합 finalAmt, 중복결제 방어, 영수증 PDF) ·
  환불(체크인 기준 환불율 정책표, 유저 자발/호스트 거절 2분류, 쿠폰 복원+포인트 환원+PG 취소 통합) ·
  정산(4일 자동 배치, 공간타입별 수수료, carry-over 이월, 세금계산서 PDF) ·
  쿠폰/포인트(쿠폰이벤트 게시→다운로드, 결제 1% 적립[7일 후 확정], 가입 5,000P) ·
  통계(일별 배치 사전집계 적재 + 조회 API + chart.js 시각화)
- 핵심 로직(결제 흐름·정산/수수료):
  결제 흐름 ─ readyPay(READY save → PG ready 요청 → tid 저장 → 결제창 redirect)
    → approve/confirm(PG 승인 → COMPLETED 전이 → 쿠폰 use + 포인트 use + 1% 적립 EARN row).
    재진입/콜백 대비 approve·confirm 멱등 처리(이미 COMPLETED면 스킵). 클라 금액 위변조 검증(baseAmt+addAmt ↔ rsvn.amt).
  환불 ─ 체크인 시점 기준 환불율(7일 100% / 4~6일 70% / 2~3일 50% / 1일 30% / 당일 0%),
    호스트 거절은 FULL(수수료 면제). 처리 시 쿠폰 복원 → 포인트 환원/적립취소 → PG cancel → 결제 CANCELED 연쇄.
  정산/수수료 ─ HostPlace 브리지로 호스트 공간 목록 확보 → Pay/Refund 공간타입별 합산 → DB 수수료율 calcFee
    (OFFICE 8% / STATION 10% / WORK_STAY 12%) → payout 산출. MIN_PAYOUT(10,000원) 미달 시 CARRIED 이월 → 다음 회차 합산.
- 미완성/이관:
  네이버페이 보류(테스트 키 발급에도 사업자등록 필수) ·
  정산 carry-over 연쇄 실측 검증 ·
  예약↔결제 상태 연동(환불 시 rsvn.cancel 트리거 — 김보현 예약 도메인 협의)
```

### 8.3 예약 / 리뷰 / 지도 / 검색 — 김보현

```
- 주요 엔티티 : 
  RsvnEntity(RSVN), BlackOutEntity(BLACKOUT, 이용불가) — enum RsvnStatus(P/S/C/R/E),
  BlackOutReasonType
  ReviewEntity(REVIEW), ReviewImgEntity(REVIEW_IMG, 첨부사진), ReviewReplyEntity(REVIEW_COMMENT,
  호스트 답글), ReviewReportEntity(REVIEW_COMPLAIN, 신고), HelpfulEntity(HELPFUL, 도움돼요)
  RecentViewedEntity(RECENT_PLACE)

- 핵심 기능 :
  예약: 예약 생성/취소, 호스트 거절, 어드민 강제취소, 회원·호스트·어드민 3-뷰 목록·상세, 상태별 통계, 이용불가(블랙아웃) 등록·조회
  리뷰: 작성/수정/삭제(소프트딜리트, S3 이미지), 공간별·내 리뷰 목록, 호스트 답글, 신고, 도움돼요, 호스트 평점 통계
  검색: 지역·타입·날짜·인원·정렬 필터 + 서버사이드 페이지네이션(Page)
  지도: SearchResDto에 latitude/longitude 제공 → 프론트 카카오맵 마커 렌더링(백엔드는 좌표 공급만)

- 핵심 로직
  예약 생성(RsvnService.save): ①공간 미선택·날짜 null/역순·인원 방어 → ②워크스테이/숙소는 공간
  checkinTime 결합해 시간 박제(오피스는 입력 그대로) → ③블랙아웃 겹침 검증 → ④확정(S) 예약 기간 중복
  검사(countOverlappingRsvn) → ⑤저장
  RsvnEntity: 생성 시 P(결제대기) → confirm() S → cancel() C / reject() R / complete() E. 각
  전이 전 상태 검증(이미 C·R·E면 차단)
  동시성·정합성: 같은 공간·기간 확정 예약 중복 차단으로 더블부킹 방지, RsvnScheduler(매 정각) —
  S+체크아웃 경과 → E 자동완료 / P+30분 경과 → 자동취소
  취소 vs 환불: 결제 전 취소는 환불 없음, 결제 후 취소·거절은 RefundEntity 존재 여부로 판별해 환불 뱃지표시.
  거절은 환불 먼저 처리 후 reject()를 마지막에 호출해 상태가 C로 덮이지 않게 함
  리뷰: 본인 예약·완료(E) 상태·14일 이내·중복 작성(예약당 1건) 검증, 별점 1~5 범위 검사,
  소프트딜리트(delYn)
  검색: QueryDSL BooleanExpression optional 필터 + 스칼라 서브쿼리는 min()/LEAST().min() 집계로 단일행
  보장(500 방지), PageImpl 페이지네이션
  성능: 목록 조회 시 결제·환불·리뷰여부를 Set/Map 일괄 조회로 N+1 제거

- 미완성/이관
  최근 검색어(RECENT_SEARCH): 프론트에 키워드 입력 UI가 없어 기능 전체 삭제 (백엔드 5개 파일 제거)
  환불 정산 로직: 4번 도메인(우영) RefundService에 위임 — 예약은 거절·취소 트리거만 호출
  공간 마스터 데이터(place/office/station/workStay): 2번 도메인(현진) 소관 — 예약·검색은 조회만
```

### 8.4 워케이션 공간 (숙소 / 워크앤스테이 / 코워킹오피스) / 찜 — 서현진

```
<!-- 담당자 작성 -->
- 주요 엔티티:
- 핵심 기능:
- 핵심 로직(등록·수정·검수·찜):
- 미완성/이관:
```

### 8.5 문의 / 공지 / FAQ / 챗봇 / 채팅 / 알림 — 추현종

```
<!-- 담당자 작성 -->
- 주요 엔티티:
- 핵심 기능:
- 핵심 로직(채팅 WebSocket·챗봇·알림 발송):
- 미완성/이관:
```

---

## 9. 변경 이력

- 2026.06: 발표 완료. 아키텍처 문서 신설(회원/인증 도메인 상세, 팀원 도메인 뼈대), AWS 전환 목표 구성·GitHub Actions CI/CD 반영.
- 2026.06: 호스트 승인 상태 전이 확장 — 재검토(어드민 R→P)·재신청(호스트 R→P, 서류 보완)·이용 제한 게이트(`assertApproved`)·재신청 건 식별(`lastRejectReason`) 추가.
- 2026.06: 결제/환불/정산 도메인 상세(8.2) 작성 — 엔티티·외부 PG 결제 흐름·환불 정책표·정산 수수료/carry-over 정리.

<!-- 갱신 시 날짜·변경 요약 한 줄씩 추가 -->
