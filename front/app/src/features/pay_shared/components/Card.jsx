import styled, { css } from "styled-components";

export const Card = styled.div`
	background: var(--white);
	border: 1px solid var(--gray-200);
	border-radius: var(--radius-lg);
	transition: all 220ms ease;

	${(props) =>
		props.padded &&
		css`
			padding: var(--space-6);
		`}

	${(props) =>
		props.elevated &&
		css`
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		`}

  ${(props) =>
		props.onClick &&
		css`
			cursor: pointer;
			&:hover {
				border-color: var(--sage);
				box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
				transform: translateY(-2px);
			}
		`}
`;
