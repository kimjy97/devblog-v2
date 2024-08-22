import Clipboard from '@/components/Clipboard';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ShareTool = (): JSX.Element => {
  const pathname = usePathname();
  const [title, setTitle] = useState('');
  const link = process.env.NEXT_PUBLIC_URL + (pathname === '/' ? '' : pathname);

  useEffect(() => {
    setTitle(document.title);
  }, [pathname])

  return (
    <Container className='tool' id='shareTool'>
      <TitleText>{title}</TitleText>
      <LinkText>
        <p>{link}</p>
        <Clipboard text={link} />
      </LinkText>
    </Container>
  )
};

export default ShareTool;

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;

  overflow: hidden;
`
const LinkText = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: calc(100% - 1rem);
  height: 2.6875rem;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  
  border-radius: 10px;
  background-color: var(--bg-search-input);
  border: 1px solid transparent;
  
  color: var(--text-normal);
  white-space: nowrap;
  overflow: auto;

  transition: 150ms;

  &>div>div{
    margin-top: 0 !important;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`
const TitleText = styled.div`
  width: calc(100% - 1rem);
  padding: 0 0.5rem;

  overflow: hidden;
  white-space: nowrap;
  color: var(--text-sub);
  font-size: 0.875rem;
  text-overflow: ellipsis;
`