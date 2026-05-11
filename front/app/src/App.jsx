import { Routes, Route, Navigate } from 'react-router-dom';

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
import UpdateStationPage from './features/place/pages/host/station/update/UpdateStationPage';
import UpdateWorkPage from './features/place/pages/host/workStay/update/UpdateWorkPage';
import UpdateCoworkingPage from './features/place/pages/host/coworking/update/UpdateCoworkingPage';

// ── 공간 탐색 (일반회원) ──────────────────────────────────
import RecentPlacePage from './features/searchPlace/recentPlace/pages/RecentPlacePage';
import SearchResultPage from './features/searchPlace/placeList/pages/user/SearchResultPage';
import MapPage from './features/searchPlace/map/pages/user/MapPage';
import StayDetailPage from './features/searchPlace/placeDetail/pages/common/StayDetailPage';
import WorkstayDetailPage from './features/searchPlace/placeDetail/pages/common/WorkstayDetailPage';
import OfficeDetailPage from './features/searchPlace/placeDetail/pages/common/OfficeDetailPage';

// ── 메인 ─────────────────────────────────────────────────
import MainPage from './features/main/pages/MainPage';

// ── 공간 검수 (관리자) ────────────────────────────────────
import SpaceApprovalPage from './features/approval/pages/admin/SpaceApprovalPage';

// ── 예약 (일반회원) ───────────────────────────────────────
import RsvnListPage from './features/rsvn/pages/user/RsvnListPage';
import RsvnDetailPage from './features/rsvn/pages/user/RsvnDetailPage';
import RsvnCalendarPage from './features/rsvn/pages/user/RsvnCalendarPage';
import RefundListPage from './features/rsvn/pages/user/RefundListPage';

// ── 예약 (호스트) ─────────────────────────────────────────
import HostRsvnListPage from './features/rsvn/pages/host/HostRsvnListPage';
import HostRsvnDetailPage from './features/rsvn/pages/host/HostRsvnDetailPage';
import HostRsvnCalendarPage from './features/rsvn/pages/host/HostRsvnCalendarPage';
import BlackoutPage from './features/rsvn/pages/host/BlackoutPage';
import BlackoutAddPage from './features/rsvn/blackout/pages/host/BlackoutAddPage';

// ── 예약 (관리자) ─────────────────────────────────────────
import AdminRsvnListPage from './features/rsvn/pages/admin/AdminRsvnListPage';
import AdminRsvnDetailPage from './features/rsvn/pages/admin/AdminRsvnDetailPage';

// ── 리뷰 (일반회원) ───────────────────────────────────────
import MyReviewPage from './features/review/pages/user/MyReviewPage';
import ReviewWritePage from './features/review/pages/user/ReviewWritePage';
import ReviewReportPage from './features/review/pages/user/ReviewReportPage';
import ReviewDetailPage from './features/review/pages/common/ReviewDetailPage';

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
import CashReceipt from './features/pay/pages/user/CashReceipt';
import PointHistory from './features/point/pages/user/PointHistory';

// ── 환불 (일반회원) ────────────────────────────────────────
import BookingCancel from './features/refund/pages/user/BookingCancel';
import RefundComplete from './features/refund/pages/user/RefundComplete';

// ── 환불 (관리자) ─────────────────────────────────────────
import RefundList from './features/refund/pages/admin/RefundList';
import RefundDetail from './features/refund/pages/admin/RefundDetail';

// ── 정산 (호스트) ──────────────────────────────────────────
import SettlementDashboard from './features/settlement/pages/host/SettlementDashboard';
import SettlementAccount from './features/settlement/pages/host/SettlementAccount';
import CommissionPolicy from './features/settlement/pages/host/CommissionPolicy';
import TaxInvoice from './features/settlement/pages/host/TaxInvoice';
import SettlementDetail from './features/settlement/pages/host/SettlementDetail';
import SettlementHistory from './features/settlement/pages/host/SettlementHistory';

// ── 대시보드 ──────────────────────────────────────────────
import AdminDashboard from './features/dashboard/pages/admin/AdminDashboard';
import HostDashboard from './features/dashboard/pages/host/HostDashboard';

// ── 통계 ──────────────────────────────────────────────────
import RevenueStats from './features/stats/pages/admin/RevenueStats';
import BookingStats from './features/stats/pages/admin/BookingStats';
import MemberStats from './features/stats/pages/admin/MemberStats';
import SpaceStats from './features/stats/pages/admin/SpaceStats';
import SalesStats from './features/stats/pages/host/SalesStats';

// ── 쿠폰 ──────────────────────────────────────────────────
import EventList from './features/coupon/pages/user/EventList';
import MyCoupons from './features/coupon/pages/user/MyCoupons';

// ── 찜 ────────────────────────────────────────────────────
// import WishListPage from './features/wishList/pages/user/WishListPage';

// ── 임시 플레이스홀더 ─────────────────────────────────────
const Todo = ({ label }) => (
  <div style={{ padding: 40, fontSize: 18, color: '#888' }}>
    🚧 {label} — 구현 예정
  </div>
);

function App() {
  return (
    <Routes>
      {/* ════════════════════════════════════════════
          메인 (헤더 별도, 사이드바 없음)
          ════════════════════════════════════════════ */}
      <Route path="/" element={<MainPage />} />

      {/* ════════════════════════════════════════════
          공간 탐색 (헤더 필요, 사이드바 없음)
          ════════════════════════════════════════════ */}
      <Route path="/spaces/search" element={<SearchResultPage />} />
      <Route path="/spaces/search/map" element={<MapPage />} />
      <Route path="/accommodations/:id" element={<StayDetailPage />} />
      <Route path="/workstays/:id" element={<WorkstayDetailPage />} />
      <Route path="/coworking-offices/:id" element={<OfficeDetailPage />} />
      <Route path="/review/:id" element={<ReviewDetailPage />} />

      {/* ════════════════════════════════════════════
          인증 레이아웃 (헤더·사이드바 없음)
          ════════════════════════════════════════════ */}
      <Route element={<AuthLayout />}>
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
          호스트 인증 레이아웃
          ════════════════════════════════════════════ */}
      <Route element={<HostAuthLayout />}>
        <Route path="/host/login" element={<HostLoginPage />} />
        <Route path="/host/signup" element={<HostSignupPage />} />
      </Route>

      {/* ════════════════════════════════════════════
          관리자 인증 레이아웃
          ════════════════════════════════════════════ */}
      <Route element={<AdminAuthLayout />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
      </Route>

      {/* ════════════════════════════════════════════
          공통 레이아웃 (헤더 + 사이드 Nav + 푸터)
          ════════════════════════════════════════════ */}
      <Route element={<DefaultLayouts />}>
        {/* 루트 리다이렉트 */}
        <Route index element={<Navigate to="/user/mypage" replace />} />

        {/* ══ USER ══ */}

        {/* 내 정보 */}
        <Route path="/user/mypage" element={<MyPage />} />
        <Route path="/user/profile" element={<ProfilePage />} />
        <Route path="/user/profile/edit" element={<ProfileEditPage />} />
        <Route path="/user/password" element={<Todo label="비밀번호 변경" />} />
        <Route path="/user/withdraw" element={<Todo label="회원 탈퇴" />} />

        {/* 호스트 신청 */}
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
        <Route path="/user/payment/receipt" element={<CashReceipt />} />
        <Route path="/user/payment" element={<PaymentHistory />} />
        <Route path="/user/payment/method" element={<PaymentMethods />} />
        <Route path="/user/payment/checkout" element={<BookingPaymentPage />} />
        <Route path="/user/payment/complete" element={<PaymentComplete />} />
        <Route path="/user/payment/fail" element={<PaymentFail />} />
        <Route path="/user/payment/:id" element={<PaymentDetail />} />
        <Route path="/user/point" element={<PointHistory />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/user/coupon" element={<MyCoupons />} />

        {/* 환불 */}
        <Route path="/user/refund/request" element={<BookingCancel />} />
        <Route path="/user/refund/complete" element={<RefundComplete />} />

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

        {/* 공지·FAQ */}
        <Route path="/notices" element={<Todo label="공지사항 목록" />} />
        <Route path="/notices/:id" element={<Todo label="공지사항 상세" />} />
        <Route path="/faqs" element={<Todo label="FAQ 목록" />} />
        <Route path="/faqs/:id" element={<Todo label="FAQ 상세" />} />

        {/* 챗봇 */}
        <Route path="/chatbot" element={<Todo label="AI 챗봇" />} />

        {/* ══ HOST ══ */}

        {/* 운영 */}
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route
          path="/host/profile"
          element={<Todo label="호스트 정보 관리" />}
        />
        <Route
          path="/host/license"
          element={<Todo label="사업자등록증 인증" />}
        />

        {/* 공간 관리 */}
        <Route path="/host/space/list" element={<SpaceListPage />} />
        <Route path="/host/space" element={<InsertSpacePage />} />
        <Route path="/host/space/:id" element={<SpaceDetailPage />} />
        <Route path="/host/space/:id/edit" element={<SpaceUpdatePage />} />
        <Route path="/host/space/:id/images" element={<ImageUpdatePage />} />

        {/* 숙소 */}
        <Route path="/host/lodging" element={<InsertStationPage />} />
        <Route path="/host/lodging/:id" element={<StationDetailPage />} />
        <Route path="/host/lodging/:id/edit" element={<UpdateStationPage />} />
        <Route path="/host/lodging/:id/images" element={<ImageUpdatePage />} />

        {/* 워크앤스테이 */}
        <Route path="/host/workstay" element={<InsertWorkPage />} />
        <Route path="/host/workstay/:id" element={<StationDetailPage />} />
        <Route path="/host/workstay/:id/edit" element={<UpdateWorkPage />} />
        <Route path="/host/workstay/:id/images" element={<ImageUpdatePage />} />

        {/* 코워킹오피스 */}
        <Route path="/host/coworking" element={<InsertCoworkingPage />} />
        <Route path="/host/coworking/:id" element={<StationDetailPage />} />
        <Route
          path="/host/coworking/:id/edit"
          element={<UpdateCoworkingPage />}
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
          path="/host/reservation/list/:id"
          element={<HostRsvnDetailPage />}
        />
        <Route
          path="/host/reservation/calendar"
          element={<HostRsvnCalendarPage />}
        />
        <Route path="/host/reservation/block" element={<BlackoutPage />} />
        <Route
          path="/host/reservation/block/add"
          element={<BlackoutAddPage />}
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
        <Route path="/host/stats/sales" element={<SalesStats />} />

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

        {/* ══ ADMIN ══ */}

        {/* 대시보드 */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

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
        <Route path="/admin/refund" element={<RefundList />} />
        <Route path="/admin/refund/:id" element={<RefundDetail />} />

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
        <Route path="/admin/stats/revenue" element={<RevenueStats />} />
        <Route path="/admin/stats/booking" element={<BookingStats />} />
        <Route path="/admin/stats/member" element={<MemberStats />} />
        <Route path="/admin/stats/space" element={<SpaceStats />} />

        {/* 운영 */}
        <Route path="/admin/inquiry" element={<Todo label="문의 관리" />} />
        <Route path="/admin/inquiry/:id" element={<Todo label="문의 상세" />} />
        <Route path="/admin/notice" element={<Todo label="공지 관리" />} />
        <Route path="/admin/notice/:id" element={<Todo label="공지 상세" />} />
        <Route path="/admin/faq" element={<Todo label="FAQ 관리" />} />
        <Route path="/admin/faq/:id" element={<Todo label="FAQ 상세" />} />
      </Route>

      {/* 404 */}
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
