import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import AmenityTableLayout from '../../layouts/admin/AmenityLayout';
import Toggle from '../../components/admin/Toggle';
// [가상 백엔드 API] 실제 프로젝트의 axios 통신 코드로 대체하세요.
const updateAmenityApi = async (dto) => {
  try {
    await axios.put(`/api/amenity`, dto);
  } catch (error) {
    console.error('실시간 전송 실패:', error);
  }
};

export default function AmenityPage() {
  const [amenityList, setAmenityList] = useState([
    {
      id: 1,
      name: '초고속 와이파이',
      commonYn: 'Y',
      workStayYn: 'Y',
      officeYn: 'Y',
      stationYn: 'N',
    },
    {
      id: 2,
      name: '듀얼 모니터',
      commonYn: 'N',
      workStayYn: 'N',
      officeYn: 'Y',
      stationYn: 'N',
    },
  ]);

  // --- 디바운스(Debounce) 구현 ---
  // 텍스트 입력 시 서버 부하를 막기 위해 사용자가 입력을 멈추고 0.5초 뒤에 백엔드로 보냅니다.
  const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  // 디바운스가 적용된 서버 전송 함수 (useCallback으로 메모이제이션)
  const delayedSendToBackend = useCallback(
    debounce((updatedRow) => {
      // 백엔드 DTO 규격에 맞게 id 제외하고 가공하여 전송
      const { name, commonYn, workStayYn, officeYn, stationYn } = updatedRow;
      updateAmenityApi({ name, commonYn, workStayYn, officeYn, stationYn });
    }, 1000),
    []
  );

  // 1. 토글 변경 핸들러 (누르는 순간 '즉시' 백엔드 전송)
  const handleToggleChange = (id, field, value) => {
    setAmenityList((prevList) => {
      return prevList.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };

          // 상태가 업데이트되는 시점에 즉시 백엔드 호출
          const { name, commonYn, workStayYn, officeYn, stationYn } =
            updatedRow;
          updateAmenityApi({ name, commonYn, workStayYn, officeYn, stationYn });

          return updatedRow;
        }
        return row;
      });
    });
  };

  // 2. 텍스트 입력 핸들러 (화면은 즉시 바뀌고, 백엔드 전송은 디바운스로 지연 처리)
  const handleNameChange = (id, value) => {
    setAmenityList((prevList) => {
      return prevList.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, name: value };

          // 글자 입력은 0.5초 동안 멈췄을 때만 백엔드로 날아감
          delayedSendToBackend(updatedRow);

          return updatedRow;
        }
        return row;
      });
    });
  };

  // 3. 행 추가 (새 행은 이름이 비어있으므로 상태만 추가하고 백엔드 전송은 안 함)
  const handleAddRow = () => {
    setAmenityList([
      ...amenityList,
      {
        id: Date.now(),
        name: '',
        commonYn: 'N',
        workStayYn: 'N',
        officeYn: 'N',
        stationYn: 'N',
      },
    ]);
  };

  // 4. 행 삭제 (삭제 사실을 백엔드에 즉시 알림 - 별도의 삭제 API가 있다고 가정)
  const handleRemoveRow = (id, name) => {
    setAmenityList(amenityList.filter((row) => row.id !== id));
    console.log(`🗑️ 백엔드 알림: [${name}] 항목이 삭제되었습니다.`);
    // axios.delete(`/api/amenity/${name}`);
  };

  return (
    <AmenityTableLayout title="편의시설 관리" onAddRow={handleAddRow}>
      <StyledTable>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>편의시설 명</th>
            <th style={{ width: '15%' }}>공통 (Common)</th>
            <th style={{ width: '15%' }}>워크스테이 (Work)</th>
            <th style={{ width: '15%' }}>오피스 (Office)</th>
            <th style={{ width: '15%' }}>숙소 (Station)</th>
            <th style={{ width: '10%' }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {amenityList.map((row) => (
            <tr key={row.id}>
              <td>
                <TableInput
                  type="text"
                  placeholder="편의시설명을 입력하세요"
                  value={row.name}
                  onChange={(e) => handleNameChange(row.id, e.target.value)}
                />
              </td>
              <td>
                <Toggle
                  checked={row.commonYn}
                  onChange={(val) =>
                    handleToggleChange(row.id, 'commonYn', val)
                  }
                />
              </td>
              <td>
                <Toggle
                  checked={row.workStayYn}
                  onChange={(val) =>
                    handleToggleChange(row.id, 'workStayYn', val)
                  }
                />
              </td>
              <td>
                <Toggle
                  checked={row.officeYn}
                  onChange={(val) =>
                    handleToggleChange(row.id, 'officeYn', val)
                  }
                />
              </td>
              <td>
                <Toggle
                  checked={row.stationYn}
                  onChange={(val) =>
                    handleToggleChange(row.id, 'stationYn', val)
                  }
                />
              </td>
              <td>
                <DeleteButton
                  onClick={() => handleRemoveRow(row.id, row.name)}
                  title="항목 삭제"
                >
                  ✕
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </AmenityTableLayout>
  );
}

// Styled Components
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #f8f9fa;
    color: #495057;
    font-size: 14px;
    font-weight: 600;
    padding: 12px;
    border-bottom: 2px solid #dee2e6;
    text-align: center; /* 헤더 글자 중앙 정렬 */
  }

  td {
    padding: 16px 12px;
    border-bottom: 1px solid #dee2e6;
    vertical-align: middle;

    /* ★ 핵심: td 안의 내용물들을 가로/세로 정중앙으로 정렬합니다.
      inline-flex나 flex를 쓰고 justify-content를 center로 줍니다.
    */
    text-align: center;
  }
`;

const TableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #2ece17;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e03131;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #ff6b6b;
  }
`;
