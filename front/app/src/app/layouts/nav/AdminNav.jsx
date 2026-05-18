import React from 'react';
import styled from 'styled-components';
import NavItem from './NavItem';
import ProfileBox from './ProfileBox';
import {
  FaHome,
  FaUserFriends,
  FaFileAlt,
  FaBuilding,
  FaSearch,
  FaCalendarAlt,
  FaStar,
  FaChair,
  FaFlag,
  FaCreditCard,
  FaMoneyBillWave,
  FaCoins,
  FaClipboardList,
  FaChartBar,
  FaCommentDots,
  FaBullhorn,
  FaQuestionCircle,
  FaCrown,
  FaChartPie,
  FaUsers,
} from 'react-icons/fa';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const GroupTitle = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: bold;
  padding: 16px 20px 8px 20px;
  letter-spacing: 1px;
`;

const adminMenuGroups = [
  {
    title: '대시보드',
    items: [{ url: '/admin/dashboard', str: '대시보드', icon: <FaHome /> }],
  },
  {
    title: '회원 · 호스트',
    items: [
      { url: '/admin/members', str: '회원 목록', icon: <FaUserFriends /> },
      {
        url: '/admin/host/apply',
        str: '호스트 신청 목록',
        icon: <FaFileAlt />,
      },
      { url: '/admin/host/list', str: '호스트 목록', icon: <FaBuilding /> },
    ],
  },
  {
    title: '공간 · 예약',
    items: [
      { url: '/admin/space/review', str: '공간 검수', icon: <FaSearch /> },
      { url: '/admin/amenity', str: '편의시설 관리', icon: <FaChair /> },
      { url: '/admin/reservation', str: '전체 예약', icon: <FaCalendarAlt /> },
      { url: '/admin/review/report', str: '리뷰 신고 처리', icon: <FaFlag /> },
    ],
  },
  {
    title: '결제 · 환불',
    items: [
      { url: '/admin/payment', str: '전체 결제', icon: <FaCreditCard /> },
      { url: '/admin/refund', str: '환불 요청', icon: <FaMoneyBillWave /> },
    ],
  },
  {
    title: '정산 · 수수료',
    items: [
      { url: '/admin/settlement/host', str: '호스트 정산', icon: <FaCoins /> },
      {
        url: '/admin/settlement/fee',
        str: '수수료 정책',
        icon: <FaClipboardList />,
      },
    ],
  },
  {
    title: '통계',
    items: [
      { url: '/admin/stats/sales', str: '통합 대시보드', icon: <FaChartPie /> },
      { url: '/admin/stats/revenue', str: '매출 통계', icon: <FaChartBar /> },
      {
        url: '/admin/stats/booking',
        str: '예약 통계',
        icon: <FaClipboardList />,
      },
      { url: '/admin/stats/member', str: '회원 통계', icon: <FaUsers /> },
      { url: '/admin/stats/space', str: '공간 통계', icon: <FaBuilding /> },
    ],
  },
  {
    title: '운영',
    items: [
      { url: '/admin/inquiry', str: '문의 관리', icon: <FaCommentDots /> },
      { url: '/admin/notice', str: '공지 관리', icon: <FaBullhorn /> },
      { url: '/admin/faq', str: 'FAQ 관리', icon: <FaQuestionCircle /> },
    ],
  },
];

function AdminNav() {
  return (
    <Wrapper>
      <ProfileBox
        badge={
          <>
            <FaCrown /> 관리자 콘솔
          </>
        }
        name="Sloway Admin"
        subInfo="김관리자 · super_admin"
        stats={[{ value: '7', label: '미처리 업무' }]}
      />
      {adminMenuGroups.map((group) => (
        <div key={group.title}>
          <GroupTitle>{group.title}</GroupTitle>
          {group.items.map((item) => (
            <NavItem key={item.url} {...item} />
          ))}
        </div>
      ))}
    </Wrapper>
  );
}

export default AdminNav;
