import { isAIChatMenuToggleState } from '@/atoms/sidebar';
import { INDEX_SIDEBAR_MOBILE } from '@/constants/zIndex';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const Overlay = (): JSX.Element => {
  const [isAIChatMenuToggle, setIsAIChatMenuToggle] = useRecoilState(isAIChatMenuToggleState);
  const className = `${isAIChatMenuToggle ? 'visible' : ''}`;

  const handleClickOutside = () => {
    setIsAIChatMenuToggle(false);
  }

  return (
    <Container
      className={className}
      onClick={handleClickOutside}
    />
  )
};

export default Overlay;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  opacity: 0;
  background-color: #0009;
  
  pointer-events: none;
  z-index: 0;
  transition: 150ms;

  &.visible {
    opacity: 1;
    pointer-events: auto;

    z-index: ${INDEX_SIDEBAR_MOBILE};
  }
`