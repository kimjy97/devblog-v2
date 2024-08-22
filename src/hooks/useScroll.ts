import { useEffect, useState, useCallback } from "react";
import { throttle } from "lodash";

const useScrollIsMax = (ref: any) => {
  const [result, setResult] = useState<any>({ isMax: false, gap: null });

  const scrollDownTextArea = useCallback(throttle(() => {
    if (ref.scrollHeight - ref.scrollTop === ref.clientHeight) {
      setResult({ isMax: true, gap: 0 });
    } else {
      setResult({ isMax: false, gap: ref.scrollHeight - ref.scrollTop - ref.clientHeight });
    }
  }, 200), [ref]);

  useEffect(() => {
    if (ref) {
      ref.addEventListener('scroll', scrollDownTextArea);
      return () => ref.removeEventListener('scroll', scrollDownTextArea);
    }
  }, [ref, scrollDownTextArea]);

  return result;
}

export { useScrollIsMax }
