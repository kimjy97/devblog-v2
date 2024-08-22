import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options: any, once = false) => {
  const containerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (once) {
          setHasIntersected(true);
          observer.disconnect();
        }
      } else {
        setIsIntersecting(false);
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [options, once]);

  return { ref: containerRef, isIntersecting, hasIntersected };
};

export default useIntersectionObserver;
