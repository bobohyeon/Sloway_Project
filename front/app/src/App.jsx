import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Layouts ──────────────────────────────────────────────
import DefaultLayouts from './app/layouts/default/DefaultLayouts';
import AuthLayout from './features/auth/layouts/AuthLayout';
import AdminAuthLayout from './features/auth/layouts/AdminAuthLayout';
import HostAuthLayout from './features/auth/layouts/HostAuthLayout';

// ── 인증 (공통) ───────────────────────────────────────────
import LoginPage from './features/auth/pages/user/LoginPage';
import SignupPage from './features/auth/pages/user/SignupPage';
import FindAccountPage from './features/auth/pages/user/FindAccountPage';
import ResetPasswordPage from './features/auth/pages/user/ResetPasswordPage';
import OAuthCallbackPage from './features/auth/pages/user/OAuthCallbackPage';

// ── 인증 (호스트) ─────────────────────────────────────────
import HostSignupPage from './features/auth/pages/host/HostSignupPage';
import HostLoginPage from './features/auth/pages/host/HostLoginPage';

// ── 인증 (관리자) ─────────────────────────────────────────
import AdminLoginPage from './features/auth/pages/admin/AdminLoginPage';
import AdminSignupPage from './features/auth/pages/admin/AdminSignupPage';

// ── 내 정보 (일반회원) ────────────────────────────────────
import MyPage from './features/account/pages/user/MyPage';
import ProfilePage from './features/account/pages/user/ProfilePage';
import ProfileEditPage from './features/account/pages/user/ProfileEditPage';

// ── 공간 (호스트) ─────────────────────────────────────────
import SpaceListPage from './features/place/pages/host/list/SpaceListPage';
import InsertSpacePage from './features/place/pages/host/insert/InsertSpacePage';
import InsertCoworkingPage from './features/place/pages/host/coworking/insert/InsertCoworkingPage';
import InsertWorkPage from './features/place/pages/host/workStay/insert/InsertWorkPage';
import ImageUpdatePage from './features/place/pages/host/update/image/ImageUpdatePage';
import SpaceUpdatePage from './features/place/pages/host/update/space/SpaceUpdatePage';
import SpaceDetailPage from './features/place/pages/host/detail/SpaceDetailPage';
import InsertStationPage from './features/place/pages/host/station/insert/InsertStationPage';
import StationDetailPage from './features/place/pages/host/detail/StationDetailPage';

// ── 공간 탐색 (일반회원) ──────────────────────────────────
import DetailPage from './features/searchPlace/placeDetail/pages/common/DetailPage';
import RecentPlacePage from './features/searchPlace/recentPlace/pages/RecentPlacePage';
import SpaceApprovalPage from './features/approval/pages/admin/SpaceApprovalPage';

// ── 예약 (일반회원) ───────────────────────────────────────
import RsvnCalendarPage from './features/rsvn/pages/user/RsvnCalendarPage';
import RefundListPage from './features/rsvn/pages/user/RefundListPage';
import RsvnDetailPage from './features/rsvn/pages/user/RsvnDetailPage';

// ── 예약 (호스트) ─────────────────────────────────────────
import HostRsvnListPage from './features/rsvn/pages/host/HostRsvnListPage';
import HostRsvnDetailPage from './features/rsvn/pages/host/HostRsvnDetailPage';
import HostRsvnCalendarPage from './features/rsvn/pages/host/HostRsvnCalendarPage';

// ── 예약 (관리자) ─────────────────────────────────────────
import AdminRsvnListPage from './features/rsvn/pages/admin/AdminRsvnListPage';
import AdminRsvnDetailPage from './features/rsvn/pages/admin/AdminRsvnDetailPage';

// ── 리뷰 (일반회원) ───────────────────────────────────────
import MyReviewPage from './features/review/pages/user/MyReviewPage';
import ReviewWritePage from './features/review/pages/user/ReviewWritePage';
import ReviewReportPage from './features/review/pages/user/ReviewReportPage';

// ── 리뷰 (호스트) ─────────────────────────────────────────
import HostReviewPage from './features/review/pages/host/HostReviewPage';

// ── 리뷰 (관리자) ─────────────────────────────────────────
import AdminReviewPage from './features/review/pages/admin/AdminReviewPage';
import AdminReviewReportPage from './features/review/pages/admin/AdminReviewReportPage';

// ── 결제 (일반회원) ────────────────────────────────────────
import BookingPaymentPage from './features/pay/pages/user/BookingPayment';
import PaymentComplete from './features/pay/pages/user/PaymentComplete';
import PaymentFail from './features/pay/pages/user/PaymentFail';
import PaymentHistory from './features/pay/pages/user/PaymentHistory';
import PaymentDetail from './features/pay/pages/user/PaymentDetail';
import PaymentMethods from './features/pay/pages/user/PaymentMethods';

// ── 환불 (일반회원) ────────────────────────────────────────
import BookingCancel from './features/refund/pages/user/BookingCancel';
import RefundComplete from './features/refund/pages/user/RefundComplete';

// ── 정산 (호스트) ──────────────────────────────────────────
import SettlementDashboard from './features/settlement/pages/host/SettlementDashboard';
import SettlementAccount from './features/settlement/pages/host/SettlementAccount';
import CommissionPolicy from './features/settlement/pages/host/CommissionPolicy';
import TaxInvoice from './features/settlement/pages/host/TaxInvoice';
import SettlementDetail from './features/settlement/pages/host/SettlementDetail';
import SettlementHistory from './features/settlement/pages/host/SettlementHistory';
import RsvnListPage from './features/rsvn/pages/user/RsvnListPage';
import BlackoutAddPage from './features/rsvn/blackout/pages/host/BlackoutAddPage';
import BlackoutPage from './features/rsvn/pages/host/BlackoutPage';

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
      </Route>

      {/* ════════════════════════════════════════════
          호스트 인증 레이아웃 (좌측 호스트 안내 패널)
          ════════════════════════════════════════════ */}
      <Route element={<HostAuthLayout />}>
        <Route path="/host/login" element={<HostLoginPage />} />
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
        <Route path="/user/mypage" element={<MyPage />} />
        <Route path="/user/profile" element={<ProfilePage />} />
        <Route path="/user/profile/edit" element={<ProfileEditPage />} />
        <Route path="/user/password" element={<Todo label="비밀번호 변경" />} />
        <Route path="/user/withdraw" element={<Todo label="회원 탈퇴" />} />

        {/* 호스트 신청 (일반회원 → 호스트 전환) */}
        <Route path="/user/host/apply" element={<Todo label="호스트 신청" />} />
        <Route
          path="/user/host/status"
          element={<Todo label="호스트 신청 현황" />}
        />

        {/* 예약 */}
        <Route path="/user/reservation" element={<RsvnListPage />} />
        <Route
          path="/user/reservation/calendar"
          element={<RsvnCalendarPage />}
        />
        <Route path="/user/reservation/cancel" element={<RefundListPage />} />
        <Route path="/user/reservation/:id" element={<RsvnDetailPage />} />

        {/* 결제·지갑 */}
        <Route path="/user/payment" element={<PaymentHistory />} />
        <Route path="/user/payment/method" element={<PaymentMethods />} />
        <Route path="/user/payment/checkout" element={<BookingPaymentPage />} />
        <Route path="/user/payment/complete" element={<PaymentComplete />} />
        <Route path="/user/payment/fail" element={<PaymentFail />} />
        <Route path="/user/payment/:id" element={<PaymentDetail />} />
        <Route path="/user/point" element={<Todo label="포인트 이력" />} />
        <Route path="/user/coupon" element={<Todo label="쿠폰함" />} />

        {/* 활동 */}
        <Route path="/user/wishlist" element={<Todo label="찜 목록" />} />
        <Route path="/user/recent" element={<RecentPlacePage />} />
        <Route path="/user/review" element={<MyReviewPage />} />
        <Route path="/user/review/write" element={<ReviewWritePage />} />
        <Route path="/user/review/report" element={<ReviewReportPage />} />
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

        {/* 환불 */}
        <Route path="/user/refund/complete" element={<RefundComplete />} />

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

        {/* 공간 등록·상세·수정 */}
        <Route path="/host/space" element={<InsertSpacePage />} />
        <Route path="/host/space/:id" element={<SpaceDetailPage />} />
        <Route path="/host/space/:id/edit" element={<SpaceUpdatePage />} />
        <Route path="/host/space/:id/images" element={<ImageUpdatePage />} />

        {/* 숙소 */}
        <Route path="/host/lodging" element={<InsertStationPage />} />
        <Route path="/host/lodging/:id" element={<StationDetailPage />} />
        <Route
          path="/host/lodging/:id/edit"
          element={<Todo label="숙소 수정" />}
        />
        <Route path="/host/lodging/:id/images" element={<ImageUpdatePage />} />

        {/* 워크앤스테이 */}
        <Route path="/host/workstay" element={<InsertWorkPage />} />
        <Route path="/host/workstay/:id" element={<StationDetailPage />} />
        <Route
          path="/host/workstay/:id/edit"
          element={<Todo label="워크앤스테이 수정" />}
        />
        <Route path="/host/workstay/:id/images" element={<ImageUpdatePage />} />

        {/* 코워킹오피스 */}
        <Route path="/host/coworking" element={<InsertCoworkingPage />} />
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
        <Route path="/host/reservation/list" element={<HostRsvnListPage />} />
        <Route
          path="/host/reservation/calendar"
          element={<HostRsvnCalendarPage />}
        />
        <Route path="/host/reservation/block" element={<BlackoutPage />} />
        <Route
          path="/host/reservation/block/add"
          element={<BlackoutAddPage />}
        />
        <Route
          path="/host/reservation/list/:id"
          element={<HostRsvnDetailPage />}
        />

        {/* 정산·통계 */}
        <Route
          path="/host/settlement/dashboard"
          element={<SettlementDashboard />}
        />
        <Route
          path="/host/settlement/history"
          element={<SettlementHistory />}
        />
        <Route
          path="/host/settlement/history/:id"
          element={<SettlementDetail />}
        />
        <Route
          path="/host/settlement/account"
          element={<SettlementAccount />}
        />
        <Route path="/host/settlement/fee" element={<CommissionPolicy />} />
        <Route path="/host/settlement/tax" element={<TaxInvoice />} />
        <Route path="/host/stats/sales" element={<Todo label="매출 통계" />} />

        {/* 소통 */}
        <Route path="/host/review" element={<HostReviewPage />} />
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
        <Route path="/admin/reservation" element={<AdminRsvnListPage />} />
        <Route
          path="/admin/reservation/:id"
          element={<AdminRsvnDetailPage />}
        />
        <Route path="/admin/review/report" element={<AdminReviewPage />} />
        <Route
          path="/admin/review/report/:id"
          element={<AdminReviewReportPage />}
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
