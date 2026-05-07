import styled from "styled-components";

export function Section({ title, action, children }) {
	return (
		<Wrap>
			<Head>
				<Title>{title}</Title>
				{action}
			</Head>
			{children}
		</Wrap>
	);
}

const Wrap = styled.section`
	margin-bottom: var(--space-6);
`;

const Head = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: var(--space-3);
`;

const Title = styled.h3`
	font-family: var(--font-display);
	font-size: 1.05rem;
	font-weight: 500;
	color: var(--gray-800);
	letter-spacing: -0.01em;
`;
