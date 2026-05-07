import React from "react";
import styled from "styled-components";
import NavItem from "./NavItem";
import ProfileBox from "./ProfileBox";
import {
	FaHome,
	FaUser,
	FaLock,
	FaFileSignature,
	FaClipboardCheck,
	FaCalendarAlt,
	FaCalendarDay,
	FaUndoAlt,
	FaCreditCard,
	FaWallet,
	FaReceipt,
	FaCoins,
	FaTicketAlt,
	FaHeart,
	FaHistory,
	FaStar,
	FaQuestionCircle,
	FaCommentDots,
	FaBell,
	FaCog,
	FaUserCircle,
} from "react-icons/fa";

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

const userMenuGroups = [
	{
		title: "내 정보",
		items: [
			{ url: "/user/mypage", str: "마이페이지 홈", icon: <FaHome /> },
			{ url: "/user/profile", str: "내 정보 관리", icon: <FaUser /> },
			{ url: "/user/password", str: "비밀번호 변경", icon: <FaLock /> },
		],
	},
	{
		title: "호스트",
		items: [
			{
				url: "/user/host/apply",
				str: "호스트 신청",
				icon: <FaFileSignature />,
			},
			{
				url: "/user/host/status",
				str: "신청 현황",
				icon: <FaClipboardCheck />,
			},
		],
	},
	{
		title: "예약",
		items: [
			{ url: "/user/reservation", str: "예약 목록", icon: <FaCalendarAlt /> },
			{
				url: "/user/reservation/calendar",
				str: "예약 달력",
				icon: <FaCalendarDay />,
			},
			{
				url: "/user/reservation/cancel",
				str: "취소·환불 내역",
				icon: <FaUndoAlt />,
			},
		],
	},
	{
		title: "결제 · 지갑",
		items: [
			{ url: "/user/payment", str: "결제 내역", icon: <FaCreditCard /> },
			{ url: "/user/payment/method", str: "결제 수단", icon: <FaWallet /> },
			{ url: "/user/point", str: "포인트", icon: <FaCoins /> },
			{ url: "/user/coupon", str: "쿠폰함", icon: <FaTicketAlt /> },
		],
	},
	{
		title: "활동",
		items: [
			{ url: "/user/wishlist", str: "찜 목록", icon: <FaHeart /> },
			{ url: "/user/recent", str: "최근 본 공간", icon: <FaHistory /> },
			{ url: "/user/review", str: "내 리뷰", icon: <FaStar /> },
			{ url: "/user/inquiry", str: "내 문의", icon: <FaQuestionCircle /> },
		],
	},
	{
		title: "소통",
		items: [
			{ url: "/user/chat", str: "1:1 채팅", icon: <FaCommentDots /> },
			{ url: "/user/notification", str: "알림 내역", icon: <FaBell /> },
			{ url: "/user/notification/setting", str: "알림 설정", icon: <FaCog /> },
		],
	},
];

function UserNav() {
	return (
		<Wrapper>
			<ProfileBox
				badge={
					<>
						<FaUserCircle /> 일반회원
					</>
				}
				name="홍길동님"
				subInfo="새싹 등급"
				stats={[
					{ value: "2,450 P", label: "포인트" },
					{ value: "3", label: "쿠폰" },
				]}
			/>
			{userMenuGroups.map((group) => (
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

export default UserNav;
