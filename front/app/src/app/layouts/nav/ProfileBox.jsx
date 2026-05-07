import React from "react";
import styled from "styled-components";

const ProfileWrapper = styled.div`
	padding: 20px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Badge = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 5px;
	padding: 3px 10px;
	background-color: rgba(255, 255, 255, 0.2);
	color: #fff;
	font-size: 11px;
	border-radius: 12px;
	margin-bottom: 8px;

	svg {
		width: 12px;
		height: 12px;
	}
`;

const Name = styled.h2`
	color: #fff;
	font-size: 20px;
	font-weight: bold;
	margin: 0 0 4px 0;
`;

const SubInfo = styled.p`
	color: rgba(255, 255, 255, 0.8);
	font-size: 12px;
	margin: 0;
`;

const StatBox = styled.div`
	display: flex;
	margin-top: 16px;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	padding: 12px;
	gap: 8px;
`;

const StatItem = styled.div`
	flex: 1;
	text-align: center;
	color: #fff;

	& + & {
		border-left: 1px solid rgba(255, 255, 255, 0.2);
	}

	.value {
		font-size: 18px;
		font-weight: bold;
	}
	.label {
		font-size: 11px;
		opacity: 0.8;
		margin-top: 2px;
	}
`;

function ProfileBox({ badge, name, subInfo, stats = [] }) {
	return (
		<ProfileWrapper>
			{badge && <Badge>{badge}</Badge>}
			<Name>{name}</Name>
			{subInfo && <SubInfo>{subInfo}</SubInfo>}

			{stats.length > 0 && (
				<StatBox>
					{stats.map((s, idx) => (
						<StatItem key={idx}>
							<div className="value">{s.value}</div>
							<div className="label">{s.label}</div>
						</StatItem>
					))}
				</StatBox>
			)}
		</ProfileWrapper>
	);
}

export default ProfileBox;
