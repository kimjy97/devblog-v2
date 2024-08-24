import { INDEX_TOOLTIP } from '@constants/zIndex';
import styled from 'styled-components';

interface IProps {
  id?: string,
  children: any,
  ct: string,
  delay?: number,
};

const Tooltip = ({ id = 'tooltip', children, ct, delay = 600 }: IProps): JSX.Element => {
  return (
    <Container id={id} $delay={delay}>
      {children}
      <TooltipWrapper>
        <p>{ct}</p>
      </TooltipWrapper>
    </Container>
  )
};
export default Tooltip;


const Container = styled.div<{ $delay: number }>`
  position: relative;

  z-index: ${INDEX_TOOLTIP};

  &:hover > div:last-child {
    bottom: -2.25rem;
    opacity: 1;
    transition: ${({ $delay }) => `100ms ${$delay}ms`};
  }
`

const TooltipWrapper = styled.div`
  position: absolute;
  padding: 0.375rem 0.625rem;
  bottom: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  
  opacity: 0;
  border-radius: 8px;
  background-color: var(--bg-tooltip);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  
  pointer-events: none;
  transition: 100ms;

  &>p{
    color: var(--text-tooltip);
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    display: none;
  }
 `

