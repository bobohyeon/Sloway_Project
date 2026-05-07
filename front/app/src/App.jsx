import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Layouts ──────────────────────────────────────────────
import DefaultLayouts from './app/layouts/default/DefaultLayouts';
import AuthLayout from './features/auth/layouts/AuthLayout';
import AdminAuthLayout from './features/auth/layouts/AdminAuthLayout';

// ── 인증 (공통) ───────────────────────────────────────────
import LoginPage from './features/auth/pages/user/LoginPage';
import SignupPage from './features/auth/pages/user/SignupPage';
import FindAccountPage from './features/auth/pages/user/FindAccountPage';
import ResetPasswordPage from './features/auth/pages/user/ResetPasswordPage';
import OAuthCallbackPage from './features/auth/pages/user/OAuthCallbackPage';

// ── 인증 (호스트) ─────────────────────────────────────────
import HostSignupPage from './features/auth/pages/host/HostSignupPage';

// ── 인증 (관리자) ─────────────────────────────────────────
import AdminLoginPage from './features/auth/pages/admin/AdminLoginPage';
import AdminSignupPage from './features/auth/pages/admin/AdminSignupPage';

// ── 공간 (호스트) ─────────────────────────────────────────
import SpaceListPage from './features/place/host/list/pages/SpaceListPage';
import InsertStationPage from './features/place/host/insert/pages/InsertStationPage';
import ImageUpdatePage from './features/place/host/update/pages/ImageUpdatePage';

// ── 공간 탐색 (일반회원) ──────────────────────────────────
import DetailPage from './features/searchPlace/placeDetail/pages/common/DetailPage';
import RecentPlacePage from './features/searchPlace/recentPlace/pages/RecentPlacePage';
import StationDetailPage from './features/place/pages/host/detail/StationDetailPage';
import SpaceApprovalPage from './features/approval/pages/admin/SpaceApprovalPage';

// ── 임시 플레이스홀더 ─────────────────────────────────────
// 아직 페이지 파일이 없는 라우트. 담당자가 페이지 생성 후 import로 교체
const Todo = ({ label }) => (
  <div style={{ padding: 40, fontSize: 18, color: '#888' }}>
    🚧 {label} — 구현 예정
  </div>
);

function App() {
  return (
    <Routes>
      {/* ════════════════════════════════════════════
				    인증 레이아웃 (헤더·사이드바 없음)
				    ════════════════════════════════════════════ */}
      <Route element={<AuthLayout />}>
        {/* 일반회원 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/oauth/callback/:provider"
          element={<OAuthCallbackPage />}
        />

        {/* 호스트 회원가입 */}
        <Route path="/host/signup" element={<HostSignupPage />} />
      </Route>

      {/* ════════════════════════════════════════════
				    관리자 인증 레이아웃 (어두운 배경)
				    ════════════════════════════════════════════ */}
      <Route element={<AdminAuthLayout />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
      </Route>

      {/* ════════════════════════════════════════════
				    공통 레이아웃 (헤더 + 사이드 Nav + 푸터)
				    path prefix로 Nav가 역할별 자동 전환됨
				    /admin → AdminNav  /host → HostNav  /user → UserNav
				    ════════════════════════════════════════════ */}
      <Route element={<DefaultLayouts />}>
        {/* ── 루트 리다이렉트 ──────────────────── */}
        <Route index element={<Navigate to="/user/mypage" replace />} />

        {/* ════════════════════════════════
					    USER — 일반회원
					    ════════════════════════════════ */}

        {/* 내 정보 */}
        <Route path="/user/mypage" element={<Todo label="마이페이지 홈" />} />
        <Route path="/user/profile" element={<Todo label="내 정보 관리" />} />
        <Route path="/user/password" element={<Todo label="비밀번호 변경" />} />
        <Route path="/user/withdraw" element={<Todo label="회원 탈퇴" />} />

        {/* 호스트 신청 (일반회원 → 호스트 전환) */}
        <Route path="/user/host/apply" element={<Todo label="호스트 신청" />} />
        <Route
          path="/user/host/status"
          element={<Todo label="호스트 신청 현황" />}
        />

        {/* 예약 */}
        <Route path="/user/reservation" element={<Todo label="예약 목록" />} />
        <Route
          path="/user/reservation/calendar"
          element={<Todo label="예약 달력" />}
        />
        <Route
          path="/user/reservation/cancel"
          element={<Todo label="취소·환불 내역" />}
        />
        <Route
          path="/user/reservation/:id"
          element={<Todo label="예약 상세" />}
        />

        {/* 결제·지갑 */}
        <Route path="/user/payment" element={<Todo label="결제 내역" />} />
        <Route
          path="/user/payment/method"
          element={<Todo label="결제 수단" />}
        />
        <Route path="/user/payment/:id" element={<Todo label="결제 상세" />} />
        <Route path="/user/point" element={<Todo label="포인트 이력" />} />
        <Route path="/user/coupon" element={<Todo label="쿠폰함" />} />

        {/* 활동 */}
        <Route path="/user/wishlist" element={<Todo label="찜 목록" />} />
        <Route path="/user/recent" element={<RecentPlacePage />} />
        <Route path="/user/review" element={<Todo label="내 리뷰 목록" />} />
        <Route path="/user/inquiry" element={<Todo label="내 문의 목록" />} />
        <Route path="/user/inquiry/:id" element={<Todo label="문의 상세" />} />

        {/* 소통 */}
        <Route path="/user/chat" element={<Todo label="1:1 채팅 목록" />} />
        <Route path="/user/chat/:roomId" element={<Todo label="채팅 상세" />} />
        <Route path="/user/notification" element={<Todo label="알림 내역" />} />
        <Route
          path="/user/notification/setting"
          element={<Todo label="알림 설정" />}
        />

        {/* 공간 탐색 */}
        <Route
          path="/spaces/search"
          element={<Todo label="공간 검색 결과" />}
        />
        <Route path="/spaces/search/map" element={<Todo label="지도 검색" />} />
        <Route path="/accommodations/:id" element={<DetailPage />} />
        <Route path="/coworking-offices/:id" element={<DetailPage />} />

        {/* 공지·FAQ (공통) */}
        <Route path="/notices" element={<Todo label="공지사항 목록" />} />
        <Route path="/notices/:id" element={<Todo label="공지사항 상세" />} />
        <Route path="/faqs" element={<Todo label="FAQ 목록" />} />
        <Route path="/faqs/:id" element={<Todo label="FAQ 상세" />} />

        {/* 챗봇 */}
        <Route path="/chatbot" element={<Todo label="AI 챗봇" />} />

        {/* ════════════════════════════════
					    HOST — 호스트
					    ════════════════════════════════ */}

        {/* 운영 */}
        <Route
          path="/host/dashboard"
          element={<Todo label="호스트 대시보드" />}
        />
        <Route
          path="/host/profile"
          element={<Todo label="호스트 정보 관리" />}
        />
        <Route
          path="/host/license"
          element={<Todo label="사업자등록증 인증" />}
        />

        {/* 공간 목록 */}
        <Route path="/host/space/list" element={<SpaceListPage />} />

        {/* 숙소 */}
        <Route path="/host/lodging" element={<InsertStationPage />} />
        <Route path="/host/lodging/:id" element={<StationDetailPage />} />
        <Route
          path="/host/lodging/:id/edit"
          element={<Todo label="숙소 수정" />}
        />
        <Route path="/host/lodging/:id/images" element={<ImageUpdatePage />} />

        {/* 워크앤스테이 */}
        <Route path="/host/workstay" element={<InsertStationPage />} />
        <Route path="/host/workstay/:id" element={<StationDetailPage />} />
        <Route
          path="/host/workstay/:id/edit"
          element={<Todo label="워크앤스테이 수정" />}
        />
        <Route path="/host/workstay/:id/images" element={<ImageUpdatePage />} />

        {/* 코워킹오피스 */}
        <Route path="/host/coworking" element={<InsertStationPage />} />
        <Route path="/host/coworking/:id" element={<StationDetailPage />} />
        <Route
          path="/host/coworking/:id/edit"
          element={<Todo label="코워킹오피스 수정" />}
        />
        <Route
          path="/host/coworking/:id/images"
          element={<ImageUpdatePage />}
        />
        <Route
          path="/host/coworking/:id/pricing"
          element={<Todo label="코워킹오피스 요금 설정" />}
        />

        {/* 예약 관리 */}
        <Route
          path="/host/reservation/list"
          element={<Todo label="호스트 예약 목록" />}
        />
        <Route
          path="/host/reservation/calendar"
          element={<Todo label="호스트 예약 달력" />}
        />
        <Route
          path="/host/reservation/block"
          element={<Todo label="이용 불가 설정" />}
        />
        <Route
          path="/host/reservation/list/:id"
          element={<Todo label="호스트 예약 상세" />}
        />

        {/* 정산·통계 */}
        <Route
          path="/host/settlement/dashboard"
          element={<Todo label="정산 대시보드" />}
        />
        <Route
          path="/host/settlement/history"
          element={<Todo label="정산 내역" />}
        />
        <Route
          path="/host/settlement/history/:id"
          element={<Todo label="정산 상세" />}
        />
        <Route
          path="/host/settlement/account"
          element={<Todo label="정산 계좌 관리" />}
        />
        <Route
          path="/host/settlement/fee"
          element={<Todo label="수수료 정책 조회" />}
        />
        <Route
          path="/host/settlement/tax"
          element={<Todo label="세금계산서" />}
        />
        <Route path="/host/stats/sales" element={<Todo label="매출 통계" />} />

        {/* 소통 */}
        <Route path="/host/review" element={<Todo label="리뷰 답글 관리" />} />
        <Route path="/host/chat" element={<Todo label="호스트 1:1 채팅" />} />
        <Route path="/host/chat/:roomId" element={<Todo label="채팅 상세" />} />
        <Route path="/host/notice" element={<Todo label="공지사항" />} />
        <Route path="/host/notification" element={<Todo label="알림 내역" />} />
        <Route
          path="/host/notification/setting"
          element={<Todo label="알림 설정" />}
        />

        {/* ════════════════════════════════
					    ADMIN — 관리자
					    ════════════════════════════════ */}

        {/* 대시보드 */}
        <Route
          path="/admin/dashboard"
          element={<Todo label="관리자 대시보드" />}
        />

        {/* 회원 관리 */}
        <Route path="/admin/members" element={<Todo label="회원 목록" />} />
        <Route path="/admin/members/:id" element={<Todo label="회원 상세" />} />

        {/* 호스트 관리 */}
        <Route
          path="/admin/host/apply"
          element={<Todo label="호스트 신청 목록" />}
        />
        <Route
          path="/admin/host/apply/:id"
          element={<Todo label="호스트 신청 상세" />}
        />
        <Route path="/admin/host/list" element={<Todo label="호스트 목록" />} />
        <Route
          path="/admin/host/list/:id"
          element={<Todo label="호스트 상세" />}
        />

        {/* 공간 검수 */}
        <Route path="/admin/space/review" element={<SpaceApprovalPage />} />
        <Route
          path="/admin/space/review/:id"
          element={<Todo label="공간 상세 검수" />}
        />

        {/* 예약·리뷰 */}
        <Route
          path="/admin/reservation"
          element={<Todo label="전체 예약 목록" />}
        />
        <Route
          path="/admin/reservation/:id"
          element={<Todo label="예약 상세" />}
        />
        <Route
          path="/admin/review/report"
          element={<Todo label="리뷰 신고 목록" />}
        />
        <Route
          path="/admin/review/report/:id"
          element={<Todo label="리뷰 신고 상세" />}
        />

        {/* 결제·환불 */}
        <Route
          path="/admin/payment"
          element={<Todo label="전체 결제 내역" />}
        />
        <Route path="/admin/payment/:id" element={<Todo label="결제 상세" />} />
        <Route path="/admin/refund" element={<Todo label="환불 목록" />} />
        <Route path="/admin/refund/:id" element={<Todo label="환불 상세" />} />

        {/* 정산·수수료 */}
        <Route
          path="/admin/settlement/host"
          element={<Todo label="호스트 정산 목록" />}
        />
        <Route
          path="/admin/settlement/host/:id"
          element={<Todo label="정산 상세" />}
        />
        <Route
          path="/admin/settlement/fee"
          element={<Todo label="수수료 정책 관리" />}
        />

        {/* 통계 */}
        <Route
          path="/admin/stats/sales"
          element={<Todo label="플랫폼 매출 통계" />}
        />

        {/* 운영 */}
        <Route path="/admin/inquiry" element={<Todo label="문의 관리" />} />
        <Route path="/admin/inquiry/:id" element={<Todo label="문의 상세" />} />
        <Route path="/admin/notice" element={<Todo label="공지 관리" />} />
        <Route path="/admin/notice/:id" element={<Todo label="공지 상세" />} />
        <Route path="/admin/faq" element={<Todo label="FAQ 관리" />} />
        <Route path="/admin/faq/:id" element={<Todo label="FAQ 상세" />} />
      </Route>

      {/* ── 404 ──────────────────────────────── */}
      <Route
        path="*"
        element={
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              fontSize: 20,
              color: '#888',
            }}
          >
            404 — 페이지를 찾을 수 없어요
          </div>
        }
      />
    </Routes>
  );
}

export default App;
