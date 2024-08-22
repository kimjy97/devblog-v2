import { useEffect } from 'react';

const useMouseDragScroll = (ref: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const ContainerRef: any = ref.current;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let velocity = 0;
    let lastMoveTime = 0;
    let inertiaFrame: number;

    const mouseDownHandler = (e: MouseEvent) => {
      isDown = true;
      const { offsetLeft, scrollLeft: containerScrollLeft } = ContainerRef;
      startX = e.pageX - offsetLeft;
      scrollLeft = containerScrollLeft;
      velocity = 0;
      lastMoveTime = e.timeStamp;
      cancelAnimationFrame(inertiaFrame);
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      applyInertia();
    };

    const mouseUpHandler = () => {
      isDown = false;
      applyInertia();
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const { offsetLeft } = ContainerRef; // 구조 분해 할당 사용
      const x = e.pageX - offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 속도 조정
      ContainerRef.scrollLeft = scrollLeft - walk;

      const now = e.timeStamp;
      const elapsed = now - lastMoveTime;
      velocity = walk / elapsed;
      lastMoveTime = now;
    };

    const applyInertia = () => {
      const inertia = () => {
        ContainerRef.scrollLeft -= velocity * 1; // 속도 배율 조정
        velocity *= 0.95; // 마찰력 조정

        if (Math.abs(velocity) > 0.1) {
          inertiaFrame = requestAnimationFrame(inertia);
        }
      };
      inertia();
    };

    if (ContainerRef) {
      ContainerRef.addEventListener('mousedown', mouseDownHandler);
      ContainerRef.addEventListener('mouseleave', mouseLeaveHandler);
      ContainerRef.addEventListener('mouseup', mouseUpHandler);
      ContainerRef.addEventListener('mousemove', mouseMoveHandler);
    }

    return () => {
      if (ContainerRef) {
        ContainerRef.removeEventListener('mousedown', mouseDownHandler);
        ContainerRef.removeEventListener('mouseleave', mouseLeaveHandler);
        ContainerRef.removeEventListener('mouseup', mouseUpHandler);
        ContainerRef.removeEventListener('mousemove', mouseMoveHandler);
        cancelAnimationFrame(inertiaFrame);
      }
    };
  }, [ref]);
};

export default useMouseDragScroll;
