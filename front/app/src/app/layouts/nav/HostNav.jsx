import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavItem from './NavItem';
import ProfileBox from './ProfileBox';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useHostMyPage } from '../../../features/account/hooks/useHostMyPage';
import { fetchHostReviewStats } from '../../../features/review/api/reviewApi';
import { fetchPlaceListByHostNo } from '../../../features/place/api/host/place/placeApi';
import {
  FaHome,
  FaUserCircle,
  FaMapMarkerAlt,
  FaHotel,
  FaBriefcase,
  FaLeaf,
  FaImages,
  FaClipboardList,
  FaCalendarAlt,
  FaBan,
  FaCoins,
  FaFileInvoiceDollar,
  FaUniversity,
  FaReceipt,
  FaChartBar,
  FaStar,
  FaBullhorn,
  FaBell,
  FaCog,
  FaStore,
  FaClipboardCheck,
  FaQuestionCircle,
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

const hostMenuGroups = [
  {
    title: '운영',
    items: [
      { url: '/host/dashboard', str: '대시보드', icon: <FaHome /> },
      { url: '/host/profile', str: '호스트 정보', icon: <FaUserCircle /> },
      {
        url: '/host/application',
        str: '신청 현황',
        icon: <FaClipboardCheck />,
      },
    ],
  },
  {
    title: '공간 관리',
    items: [
      {
        url: '/host/space/list',
        str: '내 공간 목록',
        icon: <FaImages />,
      },
      {
        url: '/host/space',
        str: '공간 등록',
        icon: <FaMapMarkerAlt />,
      },
      { url: '/host/lodging', str: '숙소 등록', icon: <FaHotel /> },
      {
        url: '/host/workstay',
        str: '워크앤스테이 등록',
        icon: <FaBriefcase />,
      },
      { url: '/host/coworking', str: '오피스 등록', icon: <FaLeaf /> },
    ],
  },
  {
    title: '예약',
    items: [
      {
        url: '/host/reservation/list',
        str: '예약 목록',
        icon: <FaClipboardList />,
      },
      {
        url: '/host/reservation/calendar',
        str: '예약 달력',
        icon: <FaCalendarAlt />,
      },
      {
        url: '/host/reservation/block',
        str: '이용 불가 설정',
        icon: <FaBan />,
      },
    ],
  },
  {
    title: '정산 · 통계',
    items: [
      {
        url: '/host/settlement/dashboard',
        str: '정산 대시보드',
        icon: <FaCoins />,
      },
      {
        url: '/host/settlement/history',
        str: '정산 내역',
        icon: <FaFileInvoiceDollar />,
      },
      {
        url: '/host/settlement/account',
        str: '정산 계좌',
        icon: <FaUniversity />,
      },
      {
        url: '/host/settlement/fee',
        str: '수수료 정책',
        icon: <FaClipboardList />,
      },
      { url: '/host/settlement/tax', str: '세금계산서', icon: <FaReceipt /> },
      { url: '/host/stats/sales', str: '매출 통계', icon: <FaChartBar /> },
    ],
  },
  {
    title: '소통',
    items: [
      { url: '/host/review', str: '리뷰 답글', icon: <FaStar /> },
      { url: '/host/inquiry', str: '내 문의', icon: <FaQuestionCircle /> },
      { url: '/notice', str: '공지사항', icon: <FaBullhorn /> },
      { url: '/host/notification', str: '알림 내역', icon: <FaBell /> },
      // { url: '/host/notification/setting', str: '알림 설정', icon: <FaCog /> },
    ],
  },
];

function HostNav() {
  const { user } = useAuth();
  const { data } = useHostMyPage();
  const [avgRating, setAvgRating] = useState(null);
  const [spaceCount, setSpaceCount] = useState('...');

  useEffect(() => {
    fetchHostReviewStats()
      .then((res) => setAvgRating(res.averageRating?.toFixed(1) ?? '-'))
      .catch(() => setAvgRating('-'));
    fetchPlaceListByHostNo()
      .then((res) => setSpaceCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setSpaceCount(0));
  }, []);

  return (
    <Wrapper>
      <ProfileBox
        badge={
          <>
            <FaStore /> 호스트 센터
          </>
        }
        name={data?.businessName ?? '사업자명'}
        subInfo={`${user?.name ?? '호스트'}님${
          data?.approvedAt ? ` · 승인 ${data.approvedAt.slice(0, 10)}` : ''
        }`}
        stats={[
          { value: spaceCount, label: '운영 공간' },
          { value: avgRating ?? '...', label: '평균 평점' },
        ]}
      />
      {hostMenuGroups.map((group) => (
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

export default HostNav;
