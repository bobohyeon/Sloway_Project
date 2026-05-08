import styled from 'styled-components';
export {
  COLOR,
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
  BackLink,
  SectionBox,
  BtnPrimary,
  BtnOutline,
  BtnSm,
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
} from '../../../rsvn/components/user/RsvnStyled';

import { COLOR } from '../../../rsvn/components/user/RsvnStyled';

export const Stars = styled.span`
  color: #c97d4c;
  font-size: ${({ $size }) => $size || 13}px;
`;

export const ReviewText = styled.p`
  font-size: 13px;
  color: #444;
  line-height: 1.6;
  margin: 10px 0;
`;

export const ReviewImgs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

export const ReviewImg = styled.div`
  width: 56px;
  height: 56px;
  background: ${COLOR.gray200};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

export const ReplyBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 8px;
  border-left: 3px solid ${COLOR.sage};
`;

export const FormBox = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 22px;
  margin-bottom: 16px;
`;

export const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: ${COLOR.black};
  margin-bottom: 6px;
  display: block;
`;

export const Req = styled.span`
  color: ${COLOR.red};
  margin-left: 2px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;
