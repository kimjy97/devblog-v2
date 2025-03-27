import { chatArrState, currentChatIdState } from '@/atoms/chatAI';
import SampleTemplate from '@/containers/AIChatFull/Contents/SampleTemplate';
import { IChatArray } from '@/types/chat';
import IconTemplate from '@public/svgs/template.svg';
import IconFood from '@public/svgs/food2.svg';
import IconDev from '@public/svgs/development.svg';
import { useRecoilValue } from 'recoil';
import styled, { keyframes } from 'styled-components';

const FirstChat = (): JSX.Element | null => {
  const chatArr = useRecoilValue(chatArrState);
  const currentChatId = useRecoilValue(currentChatIdState);
  const arr: any[] | undefined = chatArr.find((i: IChatArray) => i.chatId === currentChatId)?.chatContents;

  return (arr && arr.length === 0) ? (
    <Container>
      <Comment>
        <p><b>새로운 채팅</b>이 시작되었습니다.</p>
        <p>AI와 다양한 종류의 대화를 나눠보세요.</p>
      </Comment>
      <Note>
        <p>
          자연스러운 <b>대화</b>는 물론, <b>이미지 생성</b>과 <b>음성·이미지 분석</b>도 지원합니다.
          <br />
          빠르고 정확하게, 당신의 질문에 최적의 답변을 드리겠습니다. 지금 바로 시작해보세요!
        </p>
      </Note>
      <SampleListLabel>
        <TemplateIcon />
        <p>샘플 템플릿</p>
      </SampleListLabel>
      <SampleList>
        <SampleTemplate
          icon={<DevIcon />}
          text={['쇼핑몰 웹서비스 만들어줘.', '데이터베이스 설계 시 고려해야 할 사항은?']}
        />
        <SampleTemplate
          icon={<FoodIcon />}
          text={['간단한 요리 레시피 추천해줘.', '점심 메뉴 추천해줘.']}
        />
        <SampleTemplate
          icon={<p>etc.</p>}
          text={['스무고개 게임 같이 하자.', '입사 면접 질문을 작성해줘.']}
        />
      </SampleList>
    </Container>
  ) : null
};

export default FirstChat;

const slideUpAni = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`
const fadeInAni = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
const scaleAni = keyframes`
  0% {
    transform: scale(0.94) translateY(10px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
`
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding-bottom: 6.25rem;
  }
`
const Comment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.625rem;

  font-size: 2.75rem;
  font-weight: 550;
  color: var(--text-normal);
  text-align: center;

  opacity: 0;

  animation: ${scaleAni} 700ms 150ms cubic-bezier(0.23, 1, 0.320, 1) forwards;

  &> p:nth-child(2) {
    font-size: 1.5rem;
    font-weight: 450;
  }

  b {
    font-weight: 600;
    color: var(--color-blue);
  }

  @media (max-width: 627px) {
    gap: 0.5rem;

    font-size: 2rem;

    &> p:nth-child(2) {
    font-size: 1.125rem;
  }
  }
`
const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4.375rem;
  margin-bottom: 5.125rem;

  color: var(--color-blue-light);
  font-size: 1rem;
  text-align: center;
  line-height: 1.5rem;
  opacity: 0;

  animation: ${fadeInAni} 800ms 300ms cubic-bezier(0.23, 1, 0.320, 1) forwards;

  b {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    margin-top: 3.125rem;
    margin-bottom: 3.875rem;

    font-size: 0.875rem;
  }
`
const SampleListLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  max-width: 45rem;

  opacity: 0;

  color: var(--text-sub);
  font-size: 1rem;

  animation: ${fadeInAni} 300ms 350ms forwards;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.125rem;
    font-size: 0.875rem;
  }
`
const TemplateIcon = styled(IconTemplate)`
  width: 0.875rem;
  height: 0.875rem;

  fill: var(--text-sub-dark);

  @media (max-width: 768px) {
    width: 0.75rem;
    height: 0.75rem;
  }
`
const SampleList = styled.ul`
  width: calc(100% - 1rem);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  max-width: 45rem;
  padding-bottom: 3.75rem;

  opacity: 0;

  animation: ${slideUpAni} 1000ms 600ms cubic-bezier(0.23, 1, 0.320, 1) forwards;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    padding-bottom: 0;
  }

  @media (max-width: 628px) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
`
const FoodIcon = styled(IconFood)`
  width: 2.125rem;
  height: 2.125rem;

  fill: #54aa4f;

  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`
const DevIcon = styled(IconDev)`
  width: 2.875rem;
  height: 2.875rem;

  stroke: #276ea4;

  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`