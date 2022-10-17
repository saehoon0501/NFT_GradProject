export const elapsedTimePeriod = (createdAt) => {
  const createdTime = new Date(createdAt);
  const currentTime = new Date();

  if (createdTime.getFullYear() < currentTime.getFullYear()) {
    return `${currentTime.getFullYear() - createdTime.getFullYear()}년 전`;
  }

  if (createdTime.getMonth() < currentTime.getMonth()) {
    return `${currentTime.getMonth() - createdTime.getMonth()}달 전`;
  }

  if (createdTime.getDate() < currentTime.getDate()) {
    return `${currentTime.getDate() - createdTime.getDate()}일 전`;
  }

  if (createdTime.getHours() < currentTime.getHours()) {
    return `${currentTime.getHours() - createdTime.getHours()}시간 전`;
  }

  if (createdTime.getMinutes() < currentTime.getMinutes()) {
    return `${currentTime.getMinutes() - createdTime.getMinutes()}분 전`;
  }

  return `${currentTime.getSeconds() - createdTime.getSeconds()}초 전`;
};
