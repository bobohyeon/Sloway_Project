import styled from "styled-components";

export function Checkbox({ label, checked, onChange, required }) {
	return (
		<Wrap>
			<Input type="checkbox" checked={checked} onChange={onChange} />
			<span>
				{label}
				{required && <Required> *</Required>}
			</span>
		</Wrap>
	);
}

const Wrap = styled.label`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
	font-size: 0.88rem;
	color: var(--gray-600);
`;

const Input = styled.input`
	width: 18px;
	height: 18px;
	accent-color: var(--sage);
	cursor: pointer;
`;

const Required = styled.span`
	color: #b85a4e;
	font-weight: 600;
	font-size: 0.75rem;
`;
