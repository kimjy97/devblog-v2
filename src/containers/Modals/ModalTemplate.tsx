import { overlayState } from '@/atoms/layout';
import { useModal } from '@/hooks/useModal';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import styled from 'styled-components';

interface IProps {
  children: React.ReactNode,
  visible: string,
  setVisibleModal: SetterOrUpdater<any> | Dispatch<SetStateAction<any>>,
}

const ModalTemplate = ({ children, visible, setVisibleModal }: IProps): JSX.Element => {
  const ref = useRef<any>(undefined);
  const [, setOverlay] = useRecoilState(overlayState);
  const { handleModalClose } = useModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node) && visible) {
        handleModalClose(setVisibleModal);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handleModalClose]);

  useEffect(() => {
    if (visible) {
      setOverlay(true);
    }
  }, [visible])

  return (
    <Container ref={ref} className={visible}>
      {children}
    </Container>
  )
};

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  max-width: 420px;
  min-height: 160px;
  
  border-radius: 16px;
  background-color: var(--bg-modal);
  box-shadow: var(--bg-modal-boxshadow);
  opacity: 0;
  will-change: transform;
  transition: 250ms cubic-bezier(0.23, 1, 0.320, 1);
  pointer-events: none;

  transform: scale(0.8);
  
  &.visible {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
`
const ModalTitle = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--bg-modal-line);

  color: var(--text-normal);
  font-size: 1.125rem;
  font-weight: 500;
`
const ModalContents = styled.div`
  padding: 1.125rem 1.5rem;
  padding-bottom: 0;

  color: var(--text-normal);
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.25rem;
`

export { ModalTemplate, ModalTitle, ModalContents };