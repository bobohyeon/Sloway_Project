import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 20px;
	color: #fff;
	font-size: 14px;
	transition: all 0.2s ease;

	&,
	&:link,
	&:visited,
	&:hover,
	&:active {
		text-decoration: none;
		color: #fff;
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	&.active {
		background-color: rgba(255, 255, 255, 0.15);
		font-weight: bold;
		border-left: 4px solid #f4efe6;
		padding-left: 16px;
	}
`;

const Icon = styled.span`
	display: inline-flex;
	justify-content: center;
	width: 20px;
	height: 20px;
	font-size: 16px;

	svg {
		width: 16px;
		height: 16px;
	}
`;

function NavItem({ url, str, icon }) {
	const location = useLocation();
	const isActive = location.pathname.startsWith(url);

	return (
		<StyledLink to={url} className={isActive ? "active" : ""}>
			{icon && <Icon>{icon}</Icon>}
			<span>{str}</span>
		</StyledLink>
	);
}

export default NavItem;
