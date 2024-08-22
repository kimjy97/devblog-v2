import { useEffect, useState } from 'react';
import styled from 'styled-components';

const MemoTool = (): JSX.Element => {
  const [memo, setMemo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (memo !== undefined) {
      localStorage.setItem('blogMemo', memo);
    }
  }, [memo]);

  useEffect(() => {
    if (!memo) {
      const text = localStorage.getItem('blogMemo') ?? '';
      setMemo(text);
    }
  }, [])

  return (
    <Container className='tool' id='memoTool'>
      <MemoContainer>
        <MemoTextArea
          value={memo}
          placeholder='메모할 내용을 입력해주세요.'
          onChange={e => setMemo(e.target.value)}
        />
      </MemoContainer>
    </Container>
  )
};

export default MemoTool;

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  overflow: hidden;
`
const MemoContainer = styled.div`
  width: calc(100% - 1.25rem);
  height: calc(100% - 1.25rem);

  border-radius: 12px;
  background-color: var(--bg-memo);

  transition: 150ms;
`
const MemoTextArea = styled.textarea`
  width: 100%;
  height: 100% !important;
  padding: 1rem;

  appearance: none;
  background-color: transparent;
  border: none;
  resize: none;

  color: var(--text-normal);
  font-size: 1rem;

  transition: 150ms;

  &::placeholder {
    color: var(--text-sub);
    opacity: 0.3;
  }

  &:focus::placeholder {
    color: transparent;
  }

  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 6px 6px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 6px 6px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: #0e0e1b;
  }
`