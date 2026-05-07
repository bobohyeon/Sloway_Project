import styled, { css } from "styled-components";

const variants = {
	success: css`
		background: rgba(168, 184, 159, 0.2);
		color: #5b6b53;
	`,
	warning: css`
		background: rgba(212, 134, 31, 0.15);
		color: #b8730f;
	`,
	danger: css`
		background: rgba(184, 90, 78, 0.15);
		color: #a04c42;
	`,
	sage: css`
		background: rgba(168, 184, 159, 0.18);
		color: #5b6b53;
	`,
	muted: css`
		background: var(--gray-100);
		color: var(--gray-600);
	`,
};

const sizes = {
	sm: css`
		padding: 2px 8px;
		font-size: 0.7rem;
	`,
	md: css`
		padding: 4px 12px;
		font-size: 0.78rem;
	`,
	lg: css`
		padding: 6px 16px;
		font-size: 0.85rem;
	`,
};

export const Badge = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-weight: 500;
	border-radius: var(--radius-full);

	${(props) => variants[props.variant || "sage"]}
	${(props) => sizes[props.size || "md"]}
`;
