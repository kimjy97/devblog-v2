import { chatArrState } from '@/atoms/chatAI';
import { modelArr } from '@/constants/chat';
import { getProgress, getToken } from '@/utils/chat';
import { numberWithCommas } from '@/utils/number';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const TokenProgress = (): JSX.Element => {
  const chatArr = useRecoilValue(chatArrState);
  const [tokenPercent, setTokenPercent] = useState<number | null>(null);
  const currentModel = modelArr[0];
  const tokenNote1 = `토큰 사용량 (${numberWithCommas(currentModel.maxToken)}/일)`;
  const tokenNote2 = `${numberWithCommas(getToken(currentModel.model))} / ${numberWithCommas(currentModel.maxToken)} (${Math.floor(tokenPercent ?? 0)}%)`;

  useEffect(() => {
    setTokenPercent(getProgress(currentModel.model, currentModel.maxToken));
  }, [chatArr])

  return (
    <Container>
      <Wrapper>
        {tokenPercent !== null &&
          <ChatToken>
            <Label>
              <p>{tokenNote1}</p>
              <p>FREE PLAN</p>
            </Label>
            <ChatTokenInfo>
              <ChatProgressBar
                className={Math.floor(tokenPercent ?? 0) >= 100 ? 'full' : ''}
                percent={Math.floor(tokenPercent) > 2 ? Math.floor(tokenPercent) : 2}
              />
              <p>{tokenNote2}</p>
            </ChatTokenInfo>
          </ChatToken>
        }
      </Wrapper>
    </Container>
  )
};
export default TokenProgress;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  padding: 1.125rem;
  padding-bottom: 1.25rem;
  padding-top: 0.375rem;
`
const Wrapper = styled.div`
  padding-top: 1rem;

  //border-top: 1px solid var(--bg-chat-line);
`
const ChatToken = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`
const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 0.5rem;
  padding-left: 0.25rem;

  p {
    color: var(--text-sub-light);
    font-size: 0.75rem;

    &:nth-child(2) {
      color: var(--color-blue-light);
      font-size: 0.625rem;
    }
  }
`
const ChatTokenInfo = styled.div`
  position: relative;
  display: flex;
  padding: 0 1.125rem;
  gap: 0.75rem;
  align-items: center;
  height: 38px;

  background-color: var(--bg-chat-token);
  border-radius: 11px;
  border: 7px solid var(--bg-chat-token);
  box-sizing: border-box;

  font-size: 0.875rem;
  color: var(--text-normal);

  transition: 150ms;

  &>p {
    width: 100%;

    font-size: 0.625rem;
    text-align: center;
    text-shadow: 0 0 8px var(--filter-invert-reverse);

    z-index: 1;
  }
`
const ChatProgressBar = styled.div<{ percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ percent }) => `${percent}%`};
  height: 100%;

  background-color: var(--bg-chat-token-progressbar);
  border-radius: 6px;

  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 500;

  z-index: 0;
  transition: 150ms;

  &.full {
    background-color: var(--bg-chat-token-progressbar-full);
  }
`