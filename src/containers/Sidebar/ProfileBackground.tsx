import styled from 'styled-components';
import Image from 'next/image';
import profileBackgroundDark from '@public/images/profile_background_1.jpg';
import profileBackgroundLight from '@public/images/profile_background_2.jpg';

const ProfileBackground = (): JSX.Element => {
  return (
    <Container>
      <Wrapper>
        <Background className='profileBackground' id='profileBackground_light'>
          <Image src={profileBackgroundLight} alt='profile_background' style={{ width: '150%' }} />
        </Background>
        <Background className='profileBackground' id='profileBackground_dark'>
          <Image src={profileBackgroundDark} alt='profile_background' style={{ width: '150%' }} />
        </Background>
      </Wrapper>
    </Container>
  )
};

export default ProfileBackground;

const Container = styled.div`
  position: sticky;
  top: 16px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1280px) {
    top: 0px;
  }
`
const Wrapper = styled.div`
  width: 100%;
  height: 180px;
  
  overflow: hidden;
  z-index: -1;
`
const Background = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 222px;

  border-top-right-radius: 16px;
  border-top-left-radius: 16px;

  overflow: hidden;
  will-change: opacity;
  transition: opacity 150ms, width 200ms;

  &>img {
    max-width: none;
  }

  @media (max-width: 1280px) {
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
  }
`