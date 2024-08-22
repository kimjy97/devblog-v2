export const getFormatLogDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}


/** 해당 Date 객체의 날짜 형식을 변환 */
export const getFormatDate = (date: Date, time: boolean) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let formattedDate = `${year}. ${month}. ${day}`;
  if (time) {
    formattedDate += ` ${hours}:${minutes}:${seconds}`;
  }

  const diffInYears = now.getFullYear() - year;
  if (diffInYears > 1 || (diffInYears === 1 && (now.getMonth() > date.getMonth() || (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate())))) {
    return formattedDate;
  }

  let relativeTime: string;
  const diffMinutes = Math.floor(diffInSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // Rough approximation

  if (diffMonths > 0) {
    relativeTime = `${diffMonths}개월 전`;
  } else if (diffDays > 0) {
    relativeTime = `${diffDays}일 전`;
  } else if (diffHours > 0) {
    relativeTime = `${diffHours}시간 전`;
  } else if (diffMinutes > 0) {
    relativeTime = `${diffMinutes}분 전`;
  } else {
    relativeTime = `방금 전`;
  }

  return time ? formattedDate : relativeTime;
}

/** 해당 날짜가 최소 설정한 day 수만큼 차이가 나는지 여부 */
export const getIsNewPost = (date: Date, difDays: number): boolean => {
  const now = new Date();
  const day = difDays * 1000 * 60 * 60 * 24;
  let result: boolean = false;

  if ((now.getTime() - date.getTime()) < day) {
    result = true;
  } else {
    result = false;
  }

  return result
}