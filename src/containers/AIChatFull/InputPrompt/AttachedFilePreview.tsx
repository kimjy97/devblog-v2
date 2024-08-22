import styled from 'styled-components';
import { IAttachedFilePreview } from '@/containers/AIChatFull/InputPrompt';
import AttachedFilePreviewItem from '@/containers/AIChatFull/InputPrompt/AttachedFilePreviewItem';

interface IProps {
  data: IAttachedFilePreview[];
};

const AttachedFilePreview = ({ data }: IProps): JSX.Element | null => {
  const list = data ? [...data] : [];

  return list.length > 0 ? (
    <Container>
      <Wrapper>
        {list.reverse().map((i: IAttachedFilePreview, idx: number) => {
          const type = i.type.split('/')[0];
          return (
            <AttachedFilePreviewItem
              key={idx}
              data={i}
              type={type}
              idx={idx}
            />
          )
        })}
      </Wrapper>
      <Mask />
    </Container>
  ) : null
};
export default AttachedFilePreview;

const Container = styled.div`
  position: relative;
  height: 108px;
  margin-bottom: 6px;
`
const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding-top: 12px;
  padding-bottom: 10px;
  padding-right: 100px;
  margin-top: -12px;

  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 14px;
  }
  &::-webkit-scrollbar-thumb {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
    box-shadow: inset 6px 6px 0 var(--bg-sb);
  }
  &::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 6px 6px 0 var(--bg-sb-hover);
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background-color: var(--bg-chat);
  }
`
const Mask = styled.div`
  position: absolute;
  top: -12px;
  right: 0px;
  width: 100px;
  height: calc(100% - 14px);

  background: linear-gradient(90deg, #0000, var(--bg-chat) );

  pointer-events: none;
`