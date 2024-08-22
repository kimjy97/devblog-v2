import { CSSProperties, useEffect, useRef } from 'react';
import Lottie, { LottieProps } from 'react-lottie-player/dist/LottiePlayerLight';
import styled from 'styled-components';

interface IProps {
  id?: string;
  className?: string;
  json?: any;
  boxStyle?: CSSProperties;
  play?: boolean;
};

const LottieBox = ({ id = '', className = '', json, boxStyle, play, ...lottieProps }: IProps & LottieProps) => {
  const options = {
    preserveAspectRatio: 'xMidYMid slice',
    animationData: json,
    ...lottieProps,
  };
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (play && playerRef.current) {
      playerRef.current.goToAndPlay(0);
    }
  }, [play]);

  return (
    <Container id={id} className={className} style={boxStyle}>
      <Lottie ref={playerRef} loop={false} play={play} {...options} />
    </Container>
  )
};
export default LottieBox;


const Container = styled.div`
  position: relative;

  &>div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`