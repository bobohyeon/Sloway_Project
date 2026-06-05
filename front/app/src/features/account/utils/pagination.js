/**
 * 페이지 번호 묶음(window) 계산.
 * 전체 페이지가 많아도 현재 페이지 주변 일정 개수만 보여준다.
 * 예) 현재 35페이지, size=10 → [31,32,...,40] 반환
 *
 * @param {number} currentPage 현재 페이지 (1-base)
 * @param {number} totalPages  전체 페이지 수
 * @param {number} windowSize  한 번에 보일 버튼 개수 (기본 10)
 */
export const getPageNumbers = (currentPage, totalPages, windowSize = 10) => {
  // 현재 페이지가 속한 묶음의 시작 (1~10이면 1, 11~20이면 11 ...)
  const blockStart =
    Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
  const blockEnd = Math.min(blockStart + windowSize - 1, totalPages);

  const pages = [];
  for (let p = blockStart; p <= blockEnd; p++) pages.push(p);

  return {
    pages, // 화면에 그릴 번호 배열
    hasPrev: blockStart > 1, // 이전 묶음 존재?
    hasNext: blockEnd < totalPages, // 다음 묶음 존재?
    prevBlockPage: blockStart - 1, // "◀" 누르면 갈 페이지
    nextBlockPage: blockEnd + 1, // "▶" 누르면 갈 페이지
  };
};
