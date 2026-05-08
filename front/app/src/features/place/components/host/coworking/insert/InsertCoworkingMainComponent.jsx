import React from 'react';
import styled from 'styled-components';

const FormCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  &:before {
    content: '🌿';
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    span {
      color: #d46a4f;
      margin-left: 4px;
    }
  }
  input,
  textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: #8fa382;
    }
  }
`;

const AddressSearchRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  input {
    flex: 1;
    background-color: #f9f9f9;
  }
`;

const SearchButton = styled.button`
  padding: 0 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  &:hover {
    background-color: #000;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background-color: #768966;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #627254;
  }
`;

function InsertCoworkingMainComponent({
  formData,
  setFormData,
  handleChange,
  setStep,
  currentStep,
}) {
  // 주소를 좌표로 변환하는 함수
  // 주소를 좌표로 변환하는 함수
  const getCoords = (address) => {
    // 1. kakao 객체가 있는지 먼저 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('카카오 지도 SDK가 로드되지 않았습니다.');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setFormData((prev) => ({
          ...prev,
          latitude: result[0].y,
          longitude: result[0].x,
        }));
      } else {
        console.error('좌표 변환 실패:', status);
      }
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') extraAddress += data.bname;
          if (data.buildingName !== '') {
            extraAddress +=
              extraAddress !== ''
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 주소 업데이트
        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
        }));

        // 좌표 추출 실행
        getCoords(fullAddress);

        // 상세주소 포커스
        document.getElementsByName('detailAddress')[0].focus();
      },
    }).open();
  };

  return (
    <FormCard>
      <SectionTitle>기본 정보 (단계: {currentStep})</SectionTitle>

      <FormGroup>
        <label>
          공간명<span>*</span>
        </label>
        <input
          name="title"
          value={formData.title}
          placeholder="예: 청평 숲속 파인뷰 워크앤스테이"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <label>
          주소<span>*</span>
        </label>
        <AddressSearchRow>
          <input
            name="address"
            value={formData.address}
            placeholder="주소 검색을 이용해 주세요"
            readOnly
          />
          <SearchButton type="button" onClick={handleAddressSearch}>
            주소 검색
          </SearchButton>
        </AddressSearchRow>
        <input
          name="detailAddress"
          value={formData.detailAddress}
          placeholder="상세 주소를 입력해 주세요 (동, 호수 등)"
          onChange={handleChange}
        />
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
          위도: {formData.latitude || '0'} / 경도: {formData.longitude || '0'}
        </div>
      </FormGroup>

      <FormGroup>
        <label>
          공간 설명<span>*</span>
        </label>
        <textarea
          name="content" // 부모 formData의 key인 content와 맞춤
          rows="5"
          value={formData.content}
          placeholder="공간을 소개해 주세요"
          onChange={handleChange}
        />
      </FormGroup>

      <SubmitButton onClick={() => setStep(currentStep + 1)}>
        다음 단계로 이동
      </SubmitButton>
    </FormCard>
  );
}

export default InsertCoworkingMainComponent;
