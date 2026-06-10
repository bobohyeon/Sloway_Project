# Sloway

> 일과 여행을 한곳에서 — 워케이션 예약 플랫폼 | KH정보교육원 2조 Chew's

전국의 워케이션 공간(숙소 / 워크앤스테이 / 코워킹오피스)을 검색·예약하고,
호스트가 공간을 등록·운영하며, 관리자가 플랫폼 전반을 관리하는
3-역할(일반회원 / 호스트 / 관리자) 기반 예약 플랫폼입니다.

---

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [개발 기간](#개발-기간)
3. [개발자 소개 (역할 분담)](#개발자-소개-역할-분담)
4. [개발 환경 및 기술 스택](#개발-환경-및-기술-스택)
5. [설치 및 실행 방법](#설치-및-실행-방법)
6. [주요 기능 (Usage)](#주요-기능-usage)
7. [아키텍처](#아키텍처)
8. [프로젝트 구조](#프로젝트-구조)
9. [협업 규칙 (Contributing)](#협업-규칙-contributing)
10. [테스트](#테스트)
11. [프로젝트 상태](#프로젝트-상태)
12. [라이선스](#라이선스)

---

## 프로젝트 소개

Sloway는 "일과 여행을 동시에" 즐기려는 워케이션 수요를 겨냥한 예약 플랫폼입니다.
일반회원은 전국의 숙소·워크앤스테이·코워킹오피스를 검색·예약하고, 호스트는 공간을 등록·운영하며,
관리자는 회원·공간·결제·정산 전반을 관리합니다.

- 3-역할(일반회원 / 호스트 / 관리자) 분리 인증
- 공간 3종 등록·검수·예약·리뷰
- 카카오페이·토스페이먼츠 결제 및 정책 기반 자동 환불·정산
- 카카오맵·문화 빅데이터 기반 공간 탐색
- 1:1 채팅·AI 챗봇·이벤트 기반 알림

> 설계 의사결정·도메인별 상세 구조는 [ARCHITECTURE.md](./ARCHITECTURE.md) 참고

---

## 개발 기간

2026.04.27 ~ 2026.06.24 (약 9주)

- 기획·설계 (ERD / Figma / 기능명세 252개)
- 도메인별 기능 개발 (백엔드 + 프론트엔드)
- 통합·기능·유효성 테스트
- AWS 클라우드 배포 및 CI/CD 구축
- 최종 발표

---

## 개발자 소개 (역할 분담)

| 역할          | 이름   | 담당 도메인                                             | 주요 구현                                                                                      |
| ------------- | ------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 조장          | 김우영 | 결제 / 환불 / 정산 / 쿠폰 / 포인트                      | 카카오페이·토스페이먼츠 결제, 정책 기반 자동 환불, 정산·수수료·세금계산서, 매출 통계           |
| 형상관리자    | 김보현 | 예약 / 리뷰 / 지도 / 검색                               | 통합 검색·필터, 예약·취소, 4항목 리뷰, 카카오맵·문화 빅데이터 지도                             |
| DB관리자      | 서현진 | 워케이션 공간 (숙소 / 워크앤스테이 / 코워킹오피스) / 찜 | 공간 3종 CRUD, 업무편의시설, 관리자 검수, 평점·조회수 기반 추천                                |
| 테스트 담당자 | 추현종 | 문의 / 공지 / FAQ / 챗봇 / 채팅 / 알림                  | 문의·공지·FAQ, 1:1 채팅(WebSocket), AI 챗봇, 이벤트 기반 알림                                  |
| 일정관리자    | 오준호 | 회원 / 인증                                             | 3-역할 인증(JWT)·카카오 OAuth, 회원·호스트·관리자 계정, 호스트 승인 워크플로우, SecurityConfig |

---

## 개발 환경 및 기술 스택

### 개발 환경

| 구분     | 내용                                         |
| -------- | -------------------------------------------- |
| IDE      | IntelliJ IDEA (백엔드), VS Code (프론트엔드) |
| 형상관리 | Git / GitHub (main ← develop ← user/{이름})  |
| 협업     | Notion (회의록·일정), 카카오톡               |

### 기술 스택

| 구분        | 기술                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| Backend     | Spring Boot, Java 21, Spring Security, Spring Data JPA, QueryDSL                         |
| Database    | PostgreSQL (Flyway 마이그레이션)                                                         |
| 인증        | JWT (jjwt, Access / Refresh), 카카오 OAuth 2.0                                           |
| 실시간/외부 | WebSocket(STOMP), AWS S3, Gmail SMTP                                                     |
| Frontend    | React 19, Vite, JavaScript, styled-components, Redux Toolkit, axios, react-router-dom v7 |
| 결제/시각화 | 카카오페이(API 연동), 토스페이먼츠 SDK, chart.js                                         |
| 인프라      | AWS (Route53 · CloudFront · ACM · ALB · EC2 · RDS · S3)                                  |
| CI/CD       | GitHub Actions                                                                           |

---

## 설치 및 실행 방법

### 사전 준비

- JDK 21, Node.js, PostgreSQL
- PostgreSQL에 `sloway` 데이터베이스 생성

### 1) 백엔드

```bash
cd back/app
./gradlew bootRun     # Windows: gradlew.bat bootRun
# → http://localhost:8080
```

> DB 접속정보·외부 키는 프로파일별 설정 파일로 분리합니다.
> `application-secret.properties`(SMTP 앱 비밀번호 등)와 `application-private.properties`는
> Git에 커밋하지 않습니다 (`.gitignore` 등록 필수).
>
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

## 주요 기능 (Usage)

**회원 / 인증 (3-역할)**

- 일반회원·호스트·관리자 분리 로그인 (JWT Access/Refresh), 카카오 소셜 로그인
- 이메일 인증 회원가입, 비밀번호 재설정(SMTP)
- 호스트 승인 워크플로우 — 신청 → 승인/반려 → 재검토/재신청 → 자격 회수/복구

**공간 / 검색 / 예약**

- 워케이션 공간(숙소·워크앤스테이·코워킹오피스) 등록·검수·운영
- 지역·날짜·인원·편의시설 통합 검색 및 정렬
- 카카오맵 지도 뷰 + 문화 빅데이터 주변 정보
- 예약·취소, 4항목 평점 리뷰·도움돼요·신고

**결제 / 정산**

- 카카오페이·토스페이먼츠 결제, 쿠폰·포인트 적용
- 취소 정책 기반 자동 환불, 호스트 정산·수수료·세금계산서
- 매출 통계 대시보드 (chart.js)

**소통 / 알림**

- 1:1 채팅 (WebSocket), AI 챗봇
- 문의게시판·공지·FAQ
- 예약·리뷰·정산·채팅 이벤트 기반 알림

---

## 아키텍처

### 배포 구성 (AWS)

```
                                         ┌─ /*       → S3 (정적 뷰: React 빌드물)
브라우저 → Route53 → CloudFront ─────────┼─ /files/* → S3 (파일 서버: 업로드 이미지)
                      (HTTPS, ACM 인증서)  └─ /api/*   → ALB → EC2 ─┬→ RDS (PostgreSQL)
                                                                   └→ S3 (파일 업로드)
```

- **CloudFront 단일 진입점** — 경로(`/*`·`/files/*`·`/api/*`)로 정적·파일·API를 한 도메인에서 분기
- **ACM** — HTTPS 인증서를 CloudFront에 적용
- **ALB + EC2** — 로드밸런서를 통한 API 서버 운영
- **RDS** — PostgreSQL 매니지드 DB / **S3** — 정적 호스팅 + 파일 저장
- **GitHub Actions** — main·develop 브랜치 빌드·테스트 후 EC2 자동 배포

> 로컬 개발은 React(:5173) ↔ Spring Boot(:8080) ↔ PostgreSQL 구성으로 동작합니다.

---

## 프로젝트 구조

```
Sloway_Project/
├── back/app/        Spring Boot (백엔드)
└── front/app/src/   React + Vite (프론트엔드)
```

> 도메인 패키지 구성·계층 구조(DDD)·예외 처리·트랜잭션 전략 등 상세 구조는 [ARCHITECTURE.md](./ARCHITECTURE.md) 참고

---

## 협업 규칙 (Contributing)

형상관리자: 김보현

1. 매일 작업 전 `git pull` 먼저
2. 브랜치 구조
   - `main` ← 형상관리자만 merge
   - `develop` ← 각자 작업 후 merge
   - `user/본인이름` ← 개인 작업 → develop으로 PR
3. 커밋 메시지 타입: `feat`(기능) / `fix`(버그 수정) / `docs`(문서) / `refactor`(리팩터링) / `test`(테스트) / `chore`(설정·기타)
4. main 직접 push 금지 — develop → main은 형상관리자만
5. 이슈·버그는 GitHub Issues에 등록 후 우선순위별 처리

---

## 테스트

- 통합 테스트 — 프론트·백엔드 API 연동, 결제·지도·채팅 동작 검증
- 기능 테스트 — 도메인별 기능 단위 동작 확인 (예약·리뷰·환불 정책 계산 등)
- 유효성 테스트 — 입력값 검증, 권한별 접근 제어(SecurityConfig 역할 매트릭스)
- 발견된 버그는 GitHub Issues로 등록·수정·재검증

---

## 프로젝트 상태

- 현재 상태: **v1.0 (KH정보교육원 최종 프로젝트 완료 버전)**
- 5개 도메인 핵심 기능 개발 완료, AWS 배포 및 CI/CD 구축
- 향후 개선 검토: Redis 캐시 도입, 결제 수단 확대, 알림 채널(이메일·푸시) 확장

---
