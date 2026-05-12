import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';

const SectionCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  margin-top: 10px;
  border: 1px solid #eee;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;

  h3 {
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .icon-bg {
    background-color: #a8b89f;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const SubText = styled.p`
  font-size: 13px;
  color: #888;
  margin-bottom: 25px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChecklistItem = styled.label`
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$checked ? '#fcfdfb' : '#fff')};
  border-color: ${(props) => (props.$checked ? '#a8b89f' : '#eee')};

  &:hover {
    border-color: #a8b89f;
  }

  input {
    display: none;
  }

  .checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid ${(props) => (props.$checked ? '#a8b89f' : '#ddd')};
    background-color: ${(props) => (props.$checked ? '#a8b89f' : '#fff')};
    border-radius: 4px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    transition: all 0.2s;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: 14px;
      font-weight: 600;
      color: ${(props) => (props.$checked ? '#333' : '#666')};
    }
    .desc {
      font-size: 12px;
      color: #aaa;
    }
  }
`;

const ProgressInfo = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #666;

  .bar-bg {
    flex: 1;
    height: 6px;
    background: #eee;
    border-radius: 3px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    background: #a8b89f;
    width: ${(props) => props.$percent}%;
    transition: width 0.3s ease;
  }
`;

const CHECKLIST_DATA = [
  {
    id: 'info',
    label: '기본 정보 확인',
    desc: '공간명, 주소, 소개글이 적절한지',
  },
  {
    id: 'image',
    label: '이미지 검수',
    desc: '실제 공간과 맞고, 선명하며, 부적절한 이미지가 없는지',
  },
  {
    id: 'price',
    label: '가격 적정성',
    desc: '유사 공간 대비 과도한 가격이 아닌지',
  },
  {
    id: 'amenity',
    label: '편의시설 확인',
    desc: '표기된 시설이 실제 준비되었는지 (사진 대조)',
  },
  {
    id: 'policy',
    label: '운영 정책 확인',
    desc: '환불 정책, 체크인 시간 등이 명확한지',
  },
  {
    id: 'legal',
    label: '법적 요건 확인',
    desc: '숙박업의 경우 신고증, 허가증 확인',
  },
];

function ChecklistSection() {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = CHECKLIST_DATA.length;
  const percent = (checkedCount / totalCount) * 100;

  return (
    <SectionCard>
      <TitleRow>
        <div className="icon-bg">
          <FaCheck />
        </div>
        <h3>검수 체크리스트</h3>
      </TitleRow>
      <SubText>공간 승인 전 모든 항목을 확인해 주세요.</SubText>

      <ListContainer>
        {CHECKLIST_DATA.map((item) => (
          <ChecklistItem key={item.id} $checked={checkedItems[item.id]}>
            <input
              type="checkbox"
              checked={!!checkedItems[item.id]}
              onChange={() => handleCheck(item.id)}
            />
            <div className="checkbox-custom">
              {checkedItems[item.id] && <FaCheck />}
            </div>
            <div className="content">
              <div className="label">{item.label}</div>
              <div className="desc">{item.desc}</div>
            </div>
          </ChecklistItem>
        ))}
      </ListContainer>

      <ProgressInfo $percent={percent}>
        <span>검수 진행률</span>
        <div className="bar-bg">
          <div className="bar-fill" />
        </div>
        <span style={{ fontWeight: 'bold', color: '#a8b89f' }}>
          {checkedCount} / {totalCount}
        </span>
      </ProgressInfo>
    </SectionCard>
  );
}

export default ChecklistSection;
