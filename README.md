# Sloway

> 워케이션 플랫폼 | 2조 Chew's

일과 여행을 동시에 — 전국 워케이션 공간(숙소 / 워크앤스테이 / 코워킹오피스)을 검색·예약하고,
호스트가 공간을 운영하며, 관리자가 플랫폼을 관리하는 3-역할 예약 플랫폼.

> 설계·기술 의사결정·도메인 상세는 [ARCHITECTURE.md](./ARCHITECTURE.md) 참고

---

## 아키텍처

### 현재 (로컬 개발 환경)

```
[React (Vite, :5173)]  ──REST/JSON──►  [Spring Boot (:8080)]  ──JPA──►  [PostgreSQL]
        │                                      │
   JWT 토큰 보관                          Spring Security + JWT 인증
   (axios 인터셉터)                       (USER / HOST / ADMIN 3-역할)
```

### 목표 (AWS 배포 — 전환 예정)

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

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Backend | Spring Boot, Java 21, Spring Security, Spring Data JPA, QueryDSL |
| Database | PostgreSQL (Flyway 마이그레이션) |
| 인증 | JWT (jjwt), 카카오 OAuth |
| 실시간/외부 | WebSocket(STOMP), AWS S3, Gmail SMTP |
| Frontend | React 19, Vite, JavaScript, styled-components, Redux Toolkit, axios, react-router-dom v7 |
| 결제/시각화 | 카카오페이(API 연동), 토스페이먼츠 SDK, chart.js |
| 인프라(예정) | AWS (Route53 · CloudFront · ACM · ALB · EC2 · RDS · S3), GitHub Actions |
| 협업 | Git/GitHub (main ← develop ← user/{이름}) |

---

## 로컬 실행 방법

### 사전 준비
- JDK 21, Node.js, PostgreSQL
- PostgreSQL에 `sloway` 데이터베이스 생성

### 1) 백엔드

```bash
cd back/app
./gradlew bootRun     # Windows: gradlew.bat bootRun
# → http://localhost:8080
```

> 환경 설정: DB 접속정보·외부 키 등은 프로파일별 설정 파일로 분리됩니다.
> `application-secret.properties`(SMTP 앱 비밀번호 등 민감정보)와
> `application-private.properties`는 Git에 커밋하지 않습니다. (`.gitignore` 등록 필수)
>
> 필요한 값 예시:
> ```properties
> spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/sloway
> spring.datasource.username=<DB 사용자>
> spring.datasource.password=<DB 비밀번호>
> # JWT secret, 카카오 OAuth, AWS S3, Gmail SMTP 키 등은 secret/private 프로파일에 작성
> ```

### 2) 프론트엔드

```bash
cd front/app
npm install
npm run dev
# → http://localhost:5173
```

---

## 팀 협업 규칙

형상관리자: 김보현

1. 매일 작업 전 `git pull` 먼저 (main 기준)
2. 브랜치 구조
   - `main` ← 형상관리자만 merge
   - `develop` ← 각자 작업 후 merge
   - `user/본인이름` ← 개인 작업 → develop으로 PR
3. 커밋 메시지 타입: `feat`(기능) / `fix`(버그 수정) / `docs`(문서) / `refactor`(리팩터링) / `test`(테스트) / `chore`(설정·기타)
4. main 직접 push 금지 — develop → main은 형상관리자만

---

## 팀 구성

| 역할 | 이름 | 담당 도메인 |
| --- | --- | --- |
| 조장 | 김우영 | 결제 / 환불 / 정산 / 쿠폰 / 포인트 |
| 형상관리자 | 김보현 | 예약 / 리뷰 / 지도 / 검색 |
| DB관리자 | 서현진 | 워케이션 공간 (숙소 / 워크앤스테이 / 코워킹오피스) / 찜 |
| 테스트 담당자 | 추현종 | 문의 / 공지 / FAQ / 챗봇 / 채팅 / 알림 |
| 일정관리자 | 오준호 | 회원 / 인증 |

---

## 주요 기능

- 3-역할 인증 (일반회원 / 호스트 / 관리자) — JWT · 카카오 소셜 로그인
- 워케이션 공간 검색 및 필터링 (숙소 / 워크앤스테이 / 코워킹오피스)
- 예약 · 취소 · 자동 환불
- 리뷰 작성 · 도움돼요 · 신고
- 카카오맵 지도 뷰 · 주변 정보
- 결제 / 정산 관리 (토스페이먼츠)
- 1:1 채팅(WebSocket) · AI 챗봇
- 예약 · 리뷰 알림

---

## 프로젝트 구조

```
Sloway_Project/
├── back/app/      Spring Boot
│   └── src/main/java/com/sloway/app/
│       ├── auth · member · host · admin · sanction   (인증·회원·호스트·관리자·제재)
│       ├── payment · reservation · review · place     (결제·환불·정산·예약·리뷰·공간)
│       ├── search · recent                            (검색·최근 본 항목)
│       ├── inquiry · notice · faq · chat · notification  (문의·공지·FAQ·채팅·알림)
│       └── common · aws                               (공통·S3)
└── front/app/src/
    ├── features/   도메인 기반 폴더 (auth, account, place, rsvn, review, pay, settlement, inquiry, chat ...)
    ├── app/        라우팅·레이아웃·store·api
    └── styles · assets
```

> 계층 구조(DDD)·패키지 전략·예외 처리·트랜잭션 전략 등 상세는 [ARCHITECTURE.md](./ARCHITECTURE.md)
