import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaBell, FaCommentDots } from "react-icons/fa";

const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 0 30px;
	border-bottom: 1px solid #e0d8c8;
`;

const Logo = styled(Link)`
	display: flex;
	align-items: center;

	&,
	&:link,
	&:visited,
	&:hover,
	&:active {
		text-decoration: none;
	}
`;

const LogoImage = styled.img`
	height: 100%;
	max-height: 50px;
	width: auto;
	object-fit: contain;
	padding: 8px 0;
`;

const LogoText = styled.span`
	font-family: "Malgun Gothic", sans-serif;
	font-size: 24px;
	font-weight: 800;
	background: linear-gradient(135deg, #2d3b2e 0%, #6b8a6e 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	letter-spacing: -0.5px;
`;

const PageTitle = styled.div`
	font-size: 14px;
	color: #888;
`;

const RightMenu = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

const IconButton = styled.button`
	position: relative;
	background: none;
	border: none;
	font-size: 18px;
	cursor: pointer;
	padding: 8px;
	border-radius: 50%;
	transition: background-color 0.2s;
	color: #555;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
		color: #2d3b2e;
	}
`;

const Badge = styled.span`
	position: absolute;
	top: 4px;
	right: 4px;
	width: 8px;
	height: 8px;
	background-color: #e74c3c;
	border-radius: 50%;
`;

const UserButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	background: none;
	border: 1px solid #d0c8b8;
	border-radius: 20px;
	padding: 5px 14px 5px 6px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
`;

const Avatar = styled.div`
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background-color: #a8b89f;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	font-weight: bold;
`;

const UserName = styled.span`
	font-size: 13px;
	color: #333;
`;

function Header() {
	const location = useLocation();
	const path = location.pathname;

	return (
		<HeaderWrapper>
			<Logo to="/">
				<LogoImage src="/Sloway_logo.png" alt="Sloway" />
				<LogoText>Sloway</LogoText>
			</Logo>

			<RightMenu>
				<IconButton title="알림">
					<FaBell size={18} />
					<Badge />
				</IconButton>

				<IconButton title="채팅">
					<FaCommentDots size={18} />
				</IconButton>

				<UserButton>
					<Avatar>감</Avatar>
					<UserName>김유저님</UserName>
				</UserButton>
			</RightMenu>
		</HeaderWrapper>
	);
}

export default Header;
