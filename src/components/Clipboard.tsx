'use client'

import LottieBox from '@/components/LottieBox';
import useToast from '@/hooks/useToast';
import { useState } from 'react';
import styled from 'styled-components';
import CopyAni from '@lotties/copy.json';

interface IProps {
  text: string;
};

const Clipboard = ({ text }: IProps): JSX.Element => {
  const { addToast } = useToast();
  const [isCopy, setIsCopy] = useState<boolean>(false);

  const handleCopyToClipboard = async () => {
    setIsCopy(true);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      addToast({ type: 1, value: '복사에 실패했습니다.' });
    }
  };
  return (
    <Container onClick={handleCopyToClipboard}>
      <LottieBox
        json={CopyAni}
        play={isCopy}
        speed={1.2}
        onComplete={() => { setIsCopy(false) }}
        boxStyle={{ width: 16, height: 16, marginTop: 0, marginLeft: 1 }}
        style={{ width: 20, height: 20 }}
      />
    </Container>
  )
};

export default Clipboard;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: 150ms;

  svg {
    opacity: 0.6;
    transition: 150ms;
  }

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
  
    border-radius: 100%;
    background-color: #fff0;

    transition: 100ms;
    z-index: 0;
  }

  &:hover{
    transform: scale(1.1);
    
    svg {
      opacity: 1;
    }

    &::before{
      background-color: #e5e7ff17;
    }
  }
  &:active {
    transform: scale(1.3);
    transition: 50ms;
  }
`