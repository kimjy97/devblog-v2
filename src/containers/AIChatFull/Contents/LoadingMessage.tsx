import styled from 'styled-components';

interface IProps {
  visible: boolean
}

const LoadingMessage = ({ visible }: IProps): JSX.Element => {
  return (
    <Container className={visible ? 'visible' : ''}>
      <div className="container">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </Container>
  )
};
export default LoadingMessage;


const Container = styled.div`
  position: absolute;
  bottom: 2.9375em;
  display: flex;
  align-items: center;
  opacity: 0;

  transition: 150ms;
  pointer-events: none;

  &.visible {
    opacity: 0.5;
  }

  .container {
    --uib-size: 40px;
    --uib-color: var(--bg-chat-message-loading);
    --uib-speed: 2.5s;
    --uib-dot-size: calc(var(--uib-size) * 0.18);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: var(--uib-size);
    height: var(--uib-dot-size);
  }

  .dot {
    position: absolute;
    top: calc(50% - var(--uib-dot-size) / 2);
    left: calc(0px - var(--uib-dot-size) / 2);
    display: block;
    height: var(--uib-dot-size);
    width: var(--uib-dot-size);
    border-radius: 50%;
    background-color: var(--uib-color);
    animation: stream var(--uib-speed) linear infinite both;
    transition: background-color 0.3s ease;
  }

  .dot:nth-child(2) {
    animation-delay: calc(var(--uib-speed) * -0.2);
  }

  .dot:nth-child(3) {
    animation-delay: calc(var(--uib-speed) * -0.4);
  }

  .dot:nth-child(4) {
    animation-delay: calc(var(--uib-speed) * -0.6);
  }

  .dot:nth-child(5) {
    animation-delay: calc(var(--uib-speed) * -0.8);
  }

  @keyframes stream {
    0%,
    100% {
      transform: translateX(0) scale(0);
    }

    50% {
      transform: translateX(calc(var(--uib-size) * 0.5)) scale(1);
    }

    99.999% {
      transform: translateX(calc(var(--uib-size))) scale(0);
    }
  }
`