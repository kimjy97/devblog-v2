import styled from 'styled-components';
import Image from 'next/image';
import { Myriad, Pretendard } from '../../../public/fonts';
import profileDefaultImage from '@public/images/accountDefault.png';

const Profile = (): JSX.Element => {
  return (
    <Container>
      <ProfileImageWrapper>
        <Image id='defaultImg' src={profileDefaultImage} alt='profileImage' />
      </ProfileImageWrapper>
      <InfoWrapper className={Myriad.className}>
        <Name>JongYeon</Name>
        <Job>Front-end dev.</Job>
        <Mention className={Pretendard.className}>😎 저의 블로그를 방문해주셔서 감사합니다!!</Mention>
      </InfoWrapper>
    </Container>
  )
};

export default Profile;

const Container = styled.div`
  position: relative;
  width: 100%;

  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 112px;
    left: 0;
    top: -42px;
    background: var(--bg-sidebar-fade);

    transition: background 150ms;

    z-index: -1;
  }
`
const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -86px;
  left: 50%;
  width: 140px;
  aspect-ratio: 1/1;
  transform: translateX(-50%);

  background-color: rgb(59, 59, 79);
  box-shadow: var(--bg-sidebar-profile-boxshadow);
  filter: var(--img-pf-filter);
  border-radius: 100%;
  overflow: hidden;

  will-change: transform;
  cursor: pointer;
  transition: filter 150ms, box-shadow 150ms, transform 250ms cubic-bezier(0.23, 1, 0.320, 1), border-radius 180ms cubic-bezier(0.23, 1, 0.320, 1);

  &>#defaultImg {
    width: 120px;
    margin-top: 30px;
  }
  &>#testImg {
    transform: rotate(-270deg) scale(1.33);
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;

    transition: 150ms;
  }
  &:hover:not(:active) {
    &>#testImg {
      filter: brightness(130%);
    }
  }
  &:active {
    transform: translateX(-50%) translateY(36%) scale(2);
    box-shadow: var(--bg-sidebar-profile-boxshadow-zoom);
    border-radius: 6px;
    z-index: 1;
  }
`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 76px;
  padding-bottom: 32px;

  background-color: var(--bg-sidebar);
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  border-top: 1px solid var(--bg-sidebar-border);

  transition: background-color 150ms, border-top 150ms;

  &>p {
    transition: color 150ms;
  }
`
const Name = styled.p`
  color: var(--text-normal);
  font-size: 1.55rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
`
const Job = styled.p`
  color: var(--text-sub);
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
`
const Mention = styled.p`
  color: var(--text-abstract);
  font-size: 0.82rem;
  font-weight: 500;
  text-align: center;
`