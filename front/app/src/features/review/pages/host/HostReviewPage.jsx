import { useState, useEffect, useMemo } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  TabBar,
  TabBtn,
  TabCount,
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import {
  findReviewsByHost,
  deleteReply,
  saveReply,
  updateReply,
} from '../../api/reviewApi';
import { findHostSpaces } from '../../../rsvn/api/rsvnApi';
import { Pagination } from '../../../pay_shared/components/Pagination';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const SearchInput = styled.input`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  flex: 1;
  min-width: 160px;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

const ReviewText = styled.div`
  font-size: 13px;
  color: #555;
  margin-top: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ReplyArea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  resize: none;
  outline: none;
  box-sizing: border-box;
  margin-top: 10px;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const ReplySubmitBtn = styled.button`
  padding: 7px 18px;
  border-radius: 8px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  margin-top: 8px;
  float: right;
  &:hover {
    background: #1a3a2a;
  }
`;

const ReplyBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 8px;
  padding: 12px 14px;
  border-left: 3px solid ${COLOR.sage};
  margin-top: 10px;
  font-size: 13px;
  color: #555;
`;

const ReplyLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${COLOR.green};
  margin-bottom: 5px;
`;

const EditBtn = styled.button`
  font-size: 12px;
  color: ${COLOR.gray400};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: ${COLOR.black};
  }
`;

const TABS = [
  { label: '전체', status: null },
  { label: '답글 필요', status: 'pending' },
  { label: '답글 완료', status: 'done' },
];

const SPACE_TYPE_LABEL = { OFFICE: '오피스', WORK_STAY: '워크앤스테이', STATION: '숙소' };

function HostReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selectedPlaceNo, setSelectedPlaceNo] = useState(null); // 1단계: 상위 공간
  const [selected, setSelected] = useState(null);               // 2단계: 하위 공간
  const [minScore, setMinScore] = useState('');
  const [period, setPeriod] = useState('');
  const [page, setPage] = useState(1);

  // placeNo 기준으로 그룹핑
  const placeGroups = useMemo(() => {
    const map = new Map();
    spaces.forEach((s) => {
      if (!map.has(s.placeNo)) {
        map.set(s.placeNo, { placeNo: s.placeNo, placeTitle: s.placeTitle ?? s.spaceName, items: [] });
      }
      map.get(s.placeNo).items.push(s);
    });
    return [...map.values()];
  }, [spaces]);

  // 선택된 상위 공간의 하위 공간 목록
  const subSpaces = useMemo(
    () => placeGroups.find((g) => g.placeNo === selectedPlaceNo)?.items ?? [],
    [placeGroups, selectedPlaceNo]
  );

  // 마운트 시 공간 목록 로드 → 첫 번째 상위/하위 공간 자동 선택
  useEffect(() => {
    findHostSpaces()
      .then((data) => {
        setSpaces(data);
        if (data.length > 0) {
          setSelectedPlaceNo(data[0].placeNo);
          setSelected(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected?.placeNo) return;
    findReview(selected, minScore, period);
  }, [selected, minScore, period]);

  async function findReview(sel, minScore, period) {
    try {
      const resp = await findReviewsByHost(
        sel.placeNo,
        sel.entityNo ?? null,
        sel.spaceType ?? null,
        minScore || null,
        period || null
      );
      setReviews(resp);
    } catch {
      setReviews([]);
    }
  }

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? reviews.length
      : reviews.filter(
          (i) => (i.replies?.length === 0 ? 'pending' : 'done') === tab.status
        ).length
  );

  const filtered = reviews
    .filter(
      (i) =>
        activeTab === 0 ||
        (i.replies?.length === 0 ? 'pending' : 'done') ===
          TABS[activeTab].status
    )
    .filter(
      (i) =>
        !keyword ||
        i.memberName.includes(keyword) ||
        i.content.includes(keyword)
    );

  const totalPages = Math.ceil(filtered.length / 10);
  const paged = filtered.slice((page - 1) * 10, page * 10);

  const handleReplyChange = (id, val) =>
    setReplyTexts((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = async (id, replyNo) => {
    if (!replyTexts[id]?.trim()) return;
    try {
      if (replyNo) {
        await updateReply(replyNo, replyTexts[id]);
      } else {
        await saveReply(id, replyTexts[id]);
      }
      await findReview(selected, minScore, period);
      setEditingId(null);
      setReplyTexts((prev) => ({ ...prev, [id]: '' }));
    } catch {
      alert('답글 처리에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title="답글 관리"
      description="게스트 리뷰에 답글을 달고 소통하세요"
      maxWidth={1200}
    >
      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => { setActiveTab(idx); setPage(1); }}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <FilterRow>
        {/* 1단계: 상위 공간명 */}
        <Select
          value={selectedPlaceNo ?? ''}
          onChange={(e) => {
            const placeNo = Number(e.target.value);
            setSelectedPlaceNo(placeNo);
            const group = placeGroups.find((g) => g.placeNo === placeNo);
            const first = group?.items[0] ?? null;
            setSelected(first);
            setPage(1);
          }}
        >
          {placeGroups.length === 0 && <option value="">공간 없음</option>}
          {placeGroups.map((g) => (
            <option key={g.placeNo} value={g.placeNo}>{g.placeTitle}</option>
          ))}
        </Select>
        {/* 2단계: 하위 공간명 */}
        <Select
          value={selected ? `${selected.entityNo ?? selected.placeNo}_${selected.spaceType ?? ''}` : ''}
          onChange={(e) => {
            const found = subSpaces.find(
              (s) => `${s.entityNo ?? s.placeNo}_${s.spaceType ?? ''}` === e.target.value
            );
            if (found) { setSelected(found); setPage(1); }
          }}
        >
          {subSpaces.length === 0 && <option value="">하위 공간 없음</option>}
          {subSpaces.map((s, i) => (
            <option key={i} value={`${s.entityNo ?? s.placeNo}_${s.spaceType ?? ''}`}>
              {s.spaceName}
            </option>
          ))}
        </Select>
        <Select value={period} onChange={(e) => { setPeriod(e.target.value); setPage(1); }}>
          <option value={''}>전체 기간</option>
          <option value={'THIS_MONTH'}>이번 달</option>
          <option value={'THREE_MONTHS'}>지난 3개월</option>
        </Select>
        <Select value={minScore} onChange={(e) => setMinScore(e.target.value)}>
          <option value={''}>전체 평점</option>
          <option value={'1'}>1점 이상</option>
          <option value={'2'}>2점 이상</option>
          <option value={'3'}>3점 이상</option>
          <option value={'4'}>4점 이상</option>
          <option value={'5'}>5점</option>
        </Select>
        <SearchInput
          placeholder="작성자명 · 내용 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </FilterRow>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: COLOR.gray400,
            fontSize: 14,
          }}
        >
          조건에 맞는 리뷰가 없어요
        </div>
      )}

      {paged.map((item) => {
        const existingReply = item.replies?.[0];
        const isEditing = editingId === item.no;

        return (
          <Card key={item.no} style={{ cursor: 'default' }}>
            <CardRow>
              <Thumb>{item.spaceType?.[0]}</Thumb>
              <CardBody>
                <TagRow>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(168,184,159,0.18)',
                      color: '#5b6b53',
                    }}
                  >
                    {item.spaceType}
                  </span>
                  <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                    {item.spaceName}
                  </span>
                </TagRow>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {item.memberName}
                  </span>
                  <Stars>
                    {'★'.repeat(item.scoreTotal)}
                    {'☆'.repeat(5 - item.scoreTotal)}
                  </Stars>
                  <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <ReviewText>{item.content}</ReviewText>

                {/* 기존 답글 */}
                {existingReply && !isEditing && (
                  <ReplyBox>
                    <ReplyLabel>
                      🏠 내 답글 ·{' '}
                      {new Date(existingReply.createdAt).toLocaleDateString(
                        'ko-KR'
                      )}
                    </ReplyLabel>
                    <div>{existingReply.content}</div>
                    <EditBtn
                      onClick={() => {
                        setEditingId(item.no);
                        handleReplyChange(item.no, existingReply.content);
                      }}
                    >
                      수정
                    </EditBtn>
                    <EditBtn
                      style={{ marginLeft: 8, color: '#c0626a' }}
                      onClick={() => {
                        deleteReply(existingReply.no).then(() =>
                          findReview(selected, minScore, period)
                        );
                      }}
                    >
                      삭제
                    </EditBtn>
                  </ReplyBox>
                )}

                {/* 답글 입력 */}
                {(!existingReply || isEditing) && (
                  <div>
                    <ReplyArea
                      rows={3}
                      placeholder="게스트에게 감사한 마음을 전해보세요"
                      value={replyTexts[item.no] || ''}
                      onChange={(e) =>
                        handleReplyChange(item.no, e.target.value)
                      }
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'flex-end',
                        marginTop: 8,
                      }}
                    >
                      {isEditing && (
                        <EditBtn onClick={() => setEditingId(null)}>
                          취소
                        </EditBtn>
                      )}
                      <ReplySubmitBtn
                        onClick={() => handleSubmit(item.no, existingReply?.no)}
                      >
                        {isEditing ? '수정 완료' : '답글 등록'}
                      </ReplySubmitBtn>
                    </div>
                  </div>
                )}
              </CardBody>
            </CardRow>
          </Card>
        );
      })}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
      />
    </PageLayout>
  );
}

export default HostReviewPage;
