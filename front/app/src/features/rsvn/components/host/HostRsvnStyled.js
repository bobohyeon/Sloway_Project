import styled from 'styled-components';
export {
  COLOR,
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
  BackLink,
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  Price,
  BtnPrimary,
  BtnOutline,
  BtnSm,
  SectionBox,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  Pagination,
  PageBtn,
} from '../user/RsvnStyled';

import { COLOR } from '../user/RsvnStyled';

export const ApproveBtn = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: ${({ $reject }) => ($reject ? '#C97D4C' : '#2D6A4F')};
  color: #fff;
  &:hover {
    filter: brightness(0.9);
  }
`;
