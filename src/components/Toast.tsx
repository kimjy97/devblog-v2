'use client'

import styled, { css, keyframes } from 'styled-components';
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { ToastListState } from "@atoms/toast";
import { Pretendard } from "../../public/fonts";
import { INDEX_TOAST } from '@constants/zIndex';
import useToast from '@hooks/useToast';
import CheckDarkAni from '@lotties/check_dark.json';
import CheckLightAni from '@lotties/check_light.json';
import ErrorAni from '@lotties/error_light.json';
import ErrorDarkAni from '@lotties/error_dark.json';
import LottieBox from '@/components/LottieBox';
import { darkmodeState } from '@/atoms/darkmode';

interface IIcon {
  json: any,
  size: {
    width: number,
    height: number,
  }
}

const Toast = () => {
  const toastList = useRecoilValue(ToastListState);
  const darkmode = useRecoilValue(darkmodeState);
  const { removeToast } = useToast();

  const getJsonIcon = (type: number) => {
    const isDarkmode = darkmode === 'dark';
    const result: IIcon = {
      json: isDarkmode ? CheckDarkAni : CheckLightAni,
      size: { width: 90, height: 90 }
    }
    switch (type) {
      case 0:
        result.json = isDarkmode ? CheckDarkAni : CheckLightAni;
        result.size.width = 90;
        result.size.height = 88;
        break;
      case 1:
        result.json = isDarkmode ? ErrorDarkAni : ErrorAni;
        result.size.width = 44;
        result.size.height = 44;
        break;
      default:
        result.json = isDarkmode ? CheckDarkAni : CheckLightAni;
        result.size.width = 90;
        result.size.height = 90;
        break;
    }

    return result;
  }

  useEffect(() => {
    if (toastList.length > 0) {
      setTimeout(() => removeToast(toastList[toastList.length - 1].key), 2200)
    }
  }, [toastList]);

  return (
    <Container className={Pretendard.className}>
      {toastList.map((toast, idx) => (
        <ToastMessage
          className={idx === toastList.length - 1 ? 'first' : ''}
          key={toast.key}
          delay={String(toast.delay)}
        >
          {toast.icon ??
            <LottieBox
              json={getJsonIcon(toast.type).json}
              play
              boxStyle={{ width: 18, height: 18 }}
              style={{ width: getJsonIcon(toast.type).size.width, height: getJsonIcon(toast.type).size.height }}
            />
          }
          <p>{toast.value}</p>
        </ToastMessage>
      ))
      }
    </Container >
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.3);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(20%);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 12px;
  position: fixed;
  top: 80px;
  left: 50%;

  cursor: default;
  pointer-events: none;
  user-select: none;

  transform: translateX(-50%);
  z-index: ${INDEX_TOAST};
`;
const ToastMessage = styled.div<{ delay: string }>`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  padding-left: 1.375rem;
  gap: 1rem;
  
  background-color: #0009;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(30px);

  color: #fff;
  font-size: 1.125rem;

  transform-origin: center 0px;

  animation: ${fadeIn} 400ms forwards cubic-bezier(0.23, 1, 0.320, 1),
             ${({ delay }) => css`${fadeOut} 200ms ${delay}ms forwards ease-in,
             ${slideDown} 200ms ${delay}ms forwards ease-in`};
`;

export default Toast;
