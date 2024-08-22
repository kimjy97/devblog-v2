import { overlayState } from "@/atoms/layout";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export const useResizeChatInput = (input: string, ref: HTMLTextAreaElement | null) => {
  const rateHeight = typeof window !== 'undefined' ? window.innerHeight * 0.32 : 0;

  const resizeTextArea = () => {
    if (ref) {
      ref.style.height = 'auto';
      if (ref.scrollHeight < rateHeight) {
        ref.style.height = `${ref.scrollHeight}px`;
        ref.style.overflow = 'hidden';
      } else {
        ref.style.height = `${rateHeight}px`;
        ref.style.overflow = 'auto';
      }
    }
  }

  useEffect(() => {
    resizeTextArea();
  }, [input, ref]);

  useEffect(() => {
    const handleResize = () => resizeTextArea();
    const handlePaste = () => setTimeout(resizeTextArea, 0);

    window.addEventListener("resize", handleResize);
    if (ref) {
      ref.addEventListener('paste', handlePaste);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ref) {
        ref.removeEventListener('paste', handlePaste);
      }
    }
  }, [ref]);

  return input;
}

export const useChatEffect = (input: string, setIsTyping: any, setIsPulsing: any) => {
  useEffect(() => {
    setIsTyping(true);
    setIsPulsing(true);
    const typeEnd = () => {
      setIsTyping(false);
    }
    const pulseEnd = () => {
      setIsPulsing(false);
    }
    const typeTimeout = setTimeout(() => typeEnd(), 600);
    const pulseTimeout = setTimeout(() => pulseEnd(), 150);

    return (() => {
      clearTimeout(typeTimeout);
      clearTimeout(pulseTimeout);
    })
  }, [input]);
}

export const useChatFastStart = (ref: HTMLTextAreaElement | null) => {
  const overlay = useRecoilValue(overlayState);
  const handleKeyDown = (event: any) => {
    if (ref) {
      if (event.isComposing) {
        return;
      }
      if (event.key === 'Enter' && event.shiftKey) {
        return;
      }
      if (event.code === 'Enter') {
        // 전송
      }
    }
  };

  const handleKeyUp = (event: any) => {
    if (ref && !overlay) {
      if (event.code === 'Enter') {
        ref.focus();
      }
      if (event.code === 'Escape') {
        ref.blur();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [ref, overlay])
}