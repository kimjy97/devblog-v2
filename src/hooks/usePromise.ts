export const useWaitForValue = <T>(getValue: () => T, targetValue: T, timeout: number = 1000): Promise<boolean> => {
  return new Promise((resolve) => {
    const abortController = new AbortController();
    const { signal } = abortController;

    if (getValue() === targetValue) {
      resolve(true);
      return;
    }

    const checkValue = () => {
      if (signal.aborted) {
        resolve(false);
        return;
      }

      if (getValue() === targetValue) {
        resolve(true);
      } else {
        requestAnimationFrame(checkValue);
      }
    };

    checkValue();

    // 1초 후에 타임아웃
    setTimeout(() => {
      abortController.abort();
      resolve(false);
    }, timeout);
  });
};
