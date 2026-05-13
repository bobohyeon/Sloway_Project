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

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background-color: white;
  appearance: none; /* 기본 화살표 숨김 */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 15px;
  cursor: pointer;
  box-sizing: border-box;
  margin-bottom: 25px;

  &:focus {
    outline: none;
    border-color: #8fa382;
  }
`;

function InsertSpaceMainComponent({
  formData,
  setFormData,
  handleChange,
  setStep,
  currentStep,
}) {
  const getCoords = (address) => {
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
      }
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;
        setFormData((prev) => ({ ...prev, address: fullAddress }));
        getCoords(fullAddress);
        document.getElementsByName('detailAddress')[0].focus();
      },
    }).open();
  };

  return (
    <FormCard>
      <SectionTitle>기본 정보 (단계: {currentStep})</SectionTitle>

      <FormGroup>
        <label>
          공간 유형<span>*</span>
        </label>
        <StyledSelect name="type" value={formData.type} onChange={handleChange}>
          <option value="" disabled>
            등록할 공간의 유형을 선택하세요
          </option>
          <option value="WORK_STAY">워크스테이</option>
          <option value="STATION">숙소</option>
          <option value="OFFICE">오피스</option>
        </StyledSelect>
      </FormGroup>

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
          name="content"
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

export default InsertSpaceMainComponent;
