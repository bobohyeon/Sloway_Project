import styled, { css } from "styled-components";

const variants = {
	primary: css`
		background: var(--sage);
		color: var(--white);
		&:hover:not(:disabled) {
			filter: brightness(0.9);
			transform: translateY(-1px);
		}
	`,
	secondary: css`
		background: var(--white);
		color: var(--gray-800);
		border: 1px solid var(--gray-200);
		&:hover:not(:disabled) {
			border-color: var(--sage);
			background: var(--gray-100);
		}
	`,
	ghost: css`
		background: transparent;
		color: var(--gray-800);
		&:hover:not(:disabled) {
			background: var(--gray-100);
		}
	`,
	danger: css`
		background: #b85a4e;
		color: var(--white);
		&:hover:not(:disabled) {
			filter: brightness(0.9);
		}
	`,
};

const sizes = {
	sm: css`
		padding: 6px 12px;
		font-size: 0.78rem;
	`,
	md: css`
		padding: 10px 18px;
		font-size: 0.9rem;
	`,
	lg: css`
		padding: 14px 24px;
		font-size: 1rem;
	`,
};

export const Button = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-weight: 500;
	border-radius: var(--radius-md);
	transition: all 180ms ease;
	font-family: inherit;

	${(props) => variants[props.variant || "primary"]}
	${(props) => sizes[props.size || "md"]}

  ${(props) =>
		props.full &&
		css`
			width: 100%;
		`}

  &:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;
