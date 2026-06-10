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
import RoleRoute from './features/auth/components/RoleRoute';
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
import ChangePasswordPage from './features/account/pages/user/ChangePasswordPage';
import WithdrawPage from './features/account/pages/user/WithdrawPage';

// ── 내 정보 (호스트) ──────────────────────────────────────
import HostProfilePage from './features/account/pages/host/HostProfilePage';
import HostProfileEditPage from './features/account/pages/host/HostProfileEditPage';
import HostWithdrawPage from './features/account/pages/host/HostWithdrawPage';
import HostStatusPage from './features/account/pages/host/HostStatusPage';
import HostChangePasswordPage from './features/account/pages/host/HostChangePasswordPage';

// ── 관리자 — 회원 관리 ──────────────────────────
import MemberListPage from './features/account/pages/admin/MemberListPage';
import MemberDetailPage from './features/account/pages/admin/MemberDetailPage';

// ── 관리자 — 호스트 신청 검토 ────────────────────
import HostApplyListPage from './features/account/pages/admin/HostApplyListPage';
import HostApplyDetailPage from './features/account/pages/admin/HostApplyDetailPage';

// ── 관리자 — 호스트 자격 관리 ────────────────────
import HostListPage from './features/account/pages/admin/HostListPage';
import HostDetailPage from './features/account/pages/admin/HostDetailPage';

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
import RoomListPage from './features/searchPlace/placeList/pages/user/RoomListPage';

// ── 메인 ─────────────────────────────────────────────────
import MainPage from './features/main/pages/MainPage';

// ── 공간 검수 (관리자) ────────────────────────────────────
import SpaceApprovalPage from './features/approval/pages/admin/SpaceApprovalPage';
import SpaceApprovalDetailPage from './features/approval/pages/admin/SpaceApprovalDetailPage';

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
import BlackoutEditPage from './features/rsvn/blackout/pages/host/BlackoutEditPage';

// ── 예약 (관리자) ─────────────────────────────────────────
import AdminRsvnListPage from './features/rsvn/pages/admin/AdminRsvnListPage';

// ── 리뷰 (일반회원) ───────────────────────────────────────
import MyReviewPage from './features/review/pages/user/MyReviewPage';
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
import TossSuccess from './features/pay/pages/user/TossSuccess';
import PaymentHistory from './features/pay/pages/user/PaymentHistory';
import PaymentDetail from './features/pay/pages/user/PaymentDetail';
import PointHistory from './features/point/pages/user/PointHistory';

// ── 결제 (관리자) ──────────────────────────────────────────
import AdminPaymentList from './features/pay/pages/admin/AdminPaymentList';
import AdminPaymentDetail from './features/pay/pages/admin/AdminPaymentDetail';

// ── 환불 (일반회원) ────────────────────────────────────────
import RefundRequest from './features/refund/pages/user/RefundRequest';
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
import AdminSettlementList from './features/settlement/pages/admin/AdminSettlementList';
import AdminSettlementDetail from './features/settlement/pages/admin/AdminSettlementDetail';
import AdminCommissionPolicy from './features/settlement/pages/admin/AdminCommissionPolicy';
import StatsOverview from './features/stats/pages/admin/StatsOverview';

// ── 쿠폰 ──────────────────────────────────────────────────
import MyCoupons from './features/coupon/pages/user/MyCoupons';
import CouponEvent from './features/couponevent/pages/user/CouponEvent';
import AdminCouponEvent from './features/couponevent/pages/admin/AdminCouponEvent';

// ── 찜 ────────────────────────────────────────────────────
import WishListPage from './features/wishList/pages/user/WishListPage';

// ── 공지 (공통) ───────────────────────────────────────────
import NoticeListPage from './features/notice/pages/common/NoticeListPage';
import NoticeDetailPage from './features/notice/pages/common/NoticeDetailPage';

// ── 공지 (관리자) ─────────────────────────────────────────
import NoticeFormPage from './features/notice/pages/admin/NoticeFormPage';
import NoticeManagePage from './features/notice/pages/admin/NoticeManagePage';

// ── 문의 (공통) ───────────────────────────────────────────
import InquiryListPage from './features/inquiry/pages/InquiryListPage';
import InquiryFormPage from './features/inquiry/pages/InquiryFormPage';
import InquiryDetailPage from './features/inquiry/pages/InquiryDetailPage';

// ── 문의 (관리자) ─────────────────────────────────────────
import InquiryManagePage from './features/inquiry/pages/admin/InquiryManagePage';

// ── FAQ (공통) ────────────────────────────────────────────
import FaqListPage from './features/faq/pages/FaqListPage';

// ── FAQ (관리자) ──────────────────────────────────────────
import FaqFormPage from './features/faq/pages/FaqFormPage';
import FaqManagePage from './features/faq/pages/admin/FaqManagePage';

// ── 알림 (공통) ───────────────────────────────────────────
import NotificationListPage from './features/notification/pages/common/NotificationListPage';
import NotificationSettingsPage from './features/notification/pages/common/NotificationSettingsPage';

// ── 채팅 (유저) ───────────────────────────────────────────
import UserChatListPage from './features/chat/pages/user/UserChatListPage';
import UserChatDetailPage from './features/chat/pages/user/UserChatDetailPage';

// ── 채팅 (호스트) ─────────────────────────────────────────
import HostChatListPage from './features/chat/pages/host/HostChatListPage';
import HostChatDetailPage from './features/chat/pages/host/HostChatDetailPage';
import ReviewWritePage from './features/review/pages/user/ReviewWritePage';
import ReviewEditPage from './features/review/pages/user/ReviewEditPage';

// ── 편의시설(관리자) ──────────────────────────────────────
import AmenityPage from './features/approval/pages/admin/AmenityPage';
import HostNotificationSettingsPage from './features/notification/pages/host/HostNotificationSettingsPage';
import HostNotificationListPage from './features/notification/pages/host/HostNotificationListPage';
import HostReapplyPage from './features/account/pages/host/HostReapplyPage';

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
      <Route path="/stations/:id" element={<StayDetailPage />} />
      <Route path="/workstays/:id" element={<WorkstayDetailPage />} />
      <Route path="/coworking-offices/:id" element={<OfficeDetailPage />} />
      <Route path="/spaces/:spaceId/rooms" element={<RoomListPage />} />

      {/* ════════════════════════════════════════════
          결제 진행 페이지 (헤더·사이드nav·푸터 없음)
          야놀자/토스처럼 결제 집중 모드
          ════════════════════════════════════════════ */}
      <Route path="/user/payment/checkout" element={<BookingPaymentPage />} />
      <Route path="/user/payment/complete" element={<PaymentComplete />} />
      <Route path="/user/payment/fail" element={<PaymentFail />} />
      <Route path="/user/payment/toss/success" element={<TossSuccess />} />

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
        {/* ══ 공통 (로그인 무관 — 가드 밖) ══ */}
        <Route path="/notice" element={<NoticeListPage />} />
        <Route path="/notice/:id" element={<NoticeDetailPage />} />
        <Route path="/faq" element={<FaqListPage />} />
        <Route path="/review/:id" element={<ReviewDetailPage />} />

        {/* ══ USER ══ */}
        <Route element={<RoleRoute allow="USER" />}>
          {/* 내 정보 */}
          <Route path="/user/mypage" element={<MyPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/profile/edit" element={<ProfileEditPage />} />
          <Route path="/user/password" element={<ChangePasswordPage />} />
          <Route path="/user/withdraw" element={<WithdrawPage />} />
          {/* 호스트 신청 */}
          <Route path="/user/host/status" element={<HostStatusPage />} />
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
          <Route path="/user/payment/:no" element={<PaymentDetail />} />
          <Route path="/user/point" element={<PointHistory />} />
          <Route path="/user/coupon/event" element={<CouponEvent />} />
          <Route path="/user/coupon" element={<MyCoupons />} />
          {/* 환불 */}
          <Route path="/user/refund/request" element={<RefundRequest />} />
          <Route path="/user/refund/complete" element={<RefundComplete />} />
          {/* 활동 */}
          <Route path="/user/wishlist" element={<WishListPage />} />
          <Route path="/user/recent" element={<RecentPlacePage />} />
          <Route path="/user/review" element={<MyReviewPage />} />
          <Route path="/user/review/write" element={<ReviewWritePage />} />
          <Route path="/user/review/edit/:id" element={<ReviewEditPage />} />
          <Route path="/user/review/report" element={<ReviewReportPage />} />
          <Route path="/user/inquiry" element={<InquiryListPage />} />
          <Route path="/user/inquiry/form" element={<InquiryFormPage />} />
          <Route
            path="/user/inquiry/form/:id"
            element={<InquiryFormPage isEdit />}
          />
          <Route path="/user/inquiry/:id" element={<InquiryDetailPage />} />
          {/* 소통 */}
          <Route path="/user/chat" element={<UserChatListPage />} />
          <Route path="/user/chat/:id" element={<UserChatDetailPage />} />
          <Route path="/user/notification" element={<NotificationListPage />} />
          <Route
            path="/user/notification/setting"
            element={<NotificationSettingsPage />}
          />
          {/* 챗봇 */}
          <Route path="/chatbot" element={<Todo label="AI 챗봇" />} />
        </Route>

        {/* ══ HOST ══ */}
        <Route element={<RoleRoute allow="HOST" />}>
          {/* 운영 */}
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/host/profile" element={<HostProfilePage />} />
          <Route path="/host/profile/edit" element={<HostProfileEditPage />} />
          <Route path="/host/password" element={<HostChangePasswordPage />} />
          <Route path="/host/withdraw" element={<HostWithdrawPage />} />
          <Route path="/host/application" element={<HostStatusPage />} />
          <Route path="/host/reapply" element={<HostReapplyPage />} />

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
          <Route
            path="/host/lodging/:id/edit"
            element={<UpdateStationPage />}
          />
          <Route
            path="/host/lodging/:id/images"
            element={<ImageUpdatePage />}
          />
          {/* 워크앤스테이 */}
          <Route path="/host/workstay" element={<InsertWorkPage />} />
          <Route path="/host/workstay/:id" element={<StationDetailPage />} />
          <Route path="/host/workstay/:id/edit" element={<UpdateWorkPage />} />
          <Route
            path="/host/workstay/:id/images"
            element={<ImageUpdatePage />}
          />
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
          <Route
            path="/host/reservation/block/edit/:id"
            element={<BlackoutEditPage />}
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
            path="/host/settlement/history/:no"
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
          <Route path="/host/inquiry" element={<InquiryListPage />} />
          <Route path="/host/inquiry/form" element={<InquiryFormPage />} />
          <Route
            path="/host/inquiry/form/:id"
            element={<InquiryFormPage isEdit />}
          />
          <Route path="/host/inquiry/:id" element={<InquiryDetailPage />} />
          <Route path="/host/review" element={<HostReviewPage />} />
          <Route path="/host/chat" element={<HostChatListPage />} />
          <Route path="/host/chat/:id" element={<HostChatDetailPage />} />
          <Route
            path="/host/notification"
            element={<HostNotificationListPage />}
          />
          {/* <Route
            path="/host/notification/setting"
            element={<HostNotificationSettingsPage />}
          /> */}
        </Route>

        {/* ══ ADMIN ══ */}
        <Route element={<RoleRoute allow="ADMIN" />}>
          {/* 대시보드 */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* 회원 관리 */}
          <Route path="/admin/members" element={<MemberListPage />} />
          <Route path="/admin/members/:id" element={<MemberDetailPage />} />
          {/* 호스트 관리 */}
          <Route path="/admin/host/apply" element={<HostApplyListPage />} />
          <Route
            path="/admin/host/apply/:id"
            element={<HostApplyDetailPage />}
          />
          <Route path="/admin/host/list" element={<HostListPage />} />
          <Route path="/admin/host/list/:hostId" element={<HostDetailPage />} />
          {/* 공간 검수 */}
          <Route path="/admin/space/review" element={<SpaceApprovalPage />} />
          <Route
            path="/admin/space/review/:type/:id"
            element={<SpaceApprovalDetailPage />}
          />
          {/* 편의시설 관리 */}
          <Route path="/admin/amenity" element={<AmenityPage />} />
          {/* 예약·리뷰 */}
          <Route path="/admin/reservation" element={<AdminRsvnListPage />} />
          <Route path="/admin/review/report" element={<AdminReviewPage />} />
          <Route
            path="/admin/review/report/:id"
            element={<AdminReviewReportPage />}
          />
          {/* 결제·환불 */}
          <Route path="/admin/payment" element={<AdminPaymentList />} />
          <Route path="/admin/payment/:no" element={<AdminPaymentDetail />} />
          <Route path="/admin/refund" element={<RefundList />} />
          <Route path="/admin/refund/:no" element={<RefundDetail />} />
          {/* 정산·수수료 */}
          <Route
            path="/admin/settlement/host"
            element={<AdminSettlementList />}
          />
          <Route
            path="/admin/settlement/host/:no"
            element={<AdminSettlementDetail />}
          />
          <Route
            path="/admin/settlement/fee"
            element={<AdminCommissionPolicy />}
          />
          {/* 쿠폰 게시 */}
          <Route path="/admin/coupon/event" element={<AdminCouponEvent />} />
          {/* 통계 */}
          <Route path="/admin/stats/sales" element={<StatsOverview />} />
          <Route path="/admin/stats/revenue" element={<RevenueStats />} />
          <Route path="/admin/stats/booking" element={<BookingStats />} />
          <Route path="/admin/stats/member" element={<MemberStats />} />
          <Route path="/admin/stats/space" element={<SpaceStats />} />
          {/* 운영 */}
          <Route path="/admin/inquiry" element={<InquiryManagePage />} />
          <Route path="/admin/inquiry/:id" element={<InquiryDetailPage />} />
          <Route path="/admin/notice" element={<NoticeManagePage />} />
          <Route path="/admin/notice/form" element={<NoticeFormPage />} />
          <Route
            path="/admin/notice/form/:id"
            element={<NoticeFormPage isEdit />}
          />
          <Route path="/admin/faq" element={<FaqManagePage />} />
          <Route path="/admin/faq/form" element={<FaqFormPage />} />
          <Route path="/admin/faq/form/:id" element={<FaqFormPage isEdit />} />
        </Route>
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
