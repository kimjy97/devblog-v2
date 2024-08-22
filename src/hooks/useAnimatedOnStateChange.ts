import { useEffect, useRef } from 'react';

const useAnimateOnStateChange = (state: any, animationName: any) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.animation = 'none'; // 애니메이션 초기화
      // 트리거를 위해 리플로우 강제, 값이 사용되지 않음을 명시하기 위해 주석 추가
      ref.current.offsetHeight; // eslint-disable-line no-unused-expressions
      ref.current.style.animation = `${animationName} 250ms ease-out`; // 애니메이션 재적용
    }
  }, [state, animationName]);

  return ref;
};

export default useAnimateOnStateChange;