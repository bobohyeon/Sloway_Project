import styled, { css } from "styled-components";

// padded/elevated 는 스타일 전용 prop — DOM 으로 새지 않게 차단(styled-components v6)
export const Card = styled.div.withConfig({
	shouldForwardProp: (prop) => !['padded', 'elevated'].includes(prop),
})`
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
