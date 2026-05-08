import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCamera, FaTrashAlt, FaUser } from 'react-icons/fa';

// ─── 검증 규칙 ──────────────────────────────────────────────
const IMG_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const IMG_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Styled ────────────────────────────────────────────────
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const AvatarBox = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--sage);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Btns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SmallBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: var(--sage);
    color: var(--sage);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: ${(p) => (p.$error ? '#e24b4a' : 'var(--gray-400)')};
  min-height: 16px;
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
/**
 * 프로필 이미지 업로드 필드
 * @param {string|null} initialUrl 초기 이미지 URL
 * @param {(file: File|null, removed: boolean) => void} onChange 변경 콜백
 */
function ProfileImageField({ initialUrl = null, onChange }) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [error, setError] = useState(null);

  // blob URL 메모리 해제
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMG_ALLOWED_TYPES.includes(file.type)) {
      setError('JPG, PNG, WEBP 형식만 가능합니다.');
      e.target.value = '';
      return;
    }
    if (file.size > IMG_MAX_SIZE) {
      setError('이미지는 5MB 이하만 가능합니다.');
      e.target.value = '';
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    const newUrl = URL.createObjectURL(file);
    setPreviewUrl(newUrl);
    setError(null);
    onChange?.(file, false);
    e.target.value = '';
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    onChange?.(null, true);
  };

  return (
    <Wrapper>
      <AvatarBox>
        {previewUrl ? <img src={previewUrl} alt="프로필" /> : <FaUser />}
      </AvatarBox>
      <Btns>
        <label>
          <HiddenFileInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSelect}
          />
          <SmallBtn as="span">
            <FaCamera /> 사진 변경
          </SmallBtn>
        </label>
        <SmallBtn type="button" onClick={handleRemove} disabled={!previewUrl}>
          <FaTrashAlt /> 사진 삭제
        </SmallBtn>
        <HelpText $error={!!error}>
          {error || 'JPG, PNG, WEBP / 최대 5MB'}
        </HelpText>
      </Btns>
    </Wrapper>
  );
}

export default ProfileImageField;
