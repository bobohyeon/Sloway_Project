export const getSpaceTypePath = (currentPath) => {
  if (!currentPath) return 'space';

  const lowerPath = currentPath.toLowerCase();

  if (lowerPath.includes('코워킹') || lowerPath.includes('coworking')) {
    return 'coworking';
  }
  if (lowerPath.includes('스테이') || lowerPath.includes('workstay')) {
    return 'workStay';
  }
  if (lowerPath.includes('숙박') || lowerPath.includes('lodging')) {
    return 'lodging';
  }

  return 'space';
};
