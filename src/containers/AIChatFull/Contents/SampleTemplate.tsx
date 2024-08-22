import { requestPromptState } from '@/atoms/chatAI';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

interface IProps {
  icon: any;
  text: string[];
};

const SampleTemplate = ({ icon, text }: IProps): JSX.Element => {
  const [, setRequestPrompt] = useRecoilState(requestPromptState);

  const handleClickText = (str: string) => {
    setRequestPrompt([str]);
  }

  return (
    <Container>
      <IconWrapper>
        {icon}
      </IconWrapper>
      <TextList>
        {text.map((i: string, idx: number) => (
          <Text key={idx} onClick={() => handleClickText(i)}>
            {i}
          </Text>
        ))
        }
      </TextList>
    </Container>
  )
};

export default SampleTemplate;

const Container = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  background-color: var(--bg-chat-sample);
  border-radius: 16px;

  transition: 150ms;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    padding: 4px 0;
    padding-right: 4px;
  }
`
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 6.875rem;
  padding-top: 0.625rem;

  &>p {
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-sub-light);

    user-select: none;
  }

  @media (max-width: 768px) {
    width: 25%;
    min-width: 5.625rem;
    max-width: 7.5rem;
    height: 100%;
    padding-top: 0;

    &>p {
      font-size: 1.5rem;
    }
  }
`
const TextList = styled.ul`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.625rem;
  padding: 0.625rem;

   @media (max-width: 768px) {
    gap: 0;
    padding-left: 0;
  }
`
const Text = styled.li`
  background-color: var(--bg-chat-sample-text);
  border-radius: 10px;
  padding: 0.5625rem 0.875rem;

  color: var(--text-normal);
  font-size: 0.875rem;
  font-weight: 450;
  text-align: center;

  will-change: transform;
  transition: background-color 30ms, transform 100ms;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-chat-sample-text-hover);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    background-color: transparent;
    text-align: left;
    padding: 0.6875rem 0.875rem;

    &:hover {
      background-color: var(--bg-chat-sample-text);
    }
  }
`
