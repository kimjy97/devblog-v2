import styled from 'styled-components';
import IconAudio from '@public/svgs/audio.svg';
import IconVideo from '@public/svgs/video.svg';
import IconDelete from '@public/svgs/delete.svg';
import Image from 'next/image';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { attachedFilePreviewState, attachedFileState } from '@/atoms/chatAI';

interface IProps {
  data: any,
  type: string,
  idx: number,
};

const AttachedFilePreviewItem = ({ data, type, idx }: IProps): JSX.Element => {
  const [attachedFile, setAttachedFile] = useRecoilState(attachedFileState);
  const [attachedFilePreview, setAttachedFilePreview] = useRecoilState(attachedFilePreviewState);
  const [errorImg, setErrorImg] = useState<boolean>(false);

  const handleDeleteItem = () => {
    const attachedFileTemp = [...attachedFile].reverse().filter((_, index) => index !== idx);
    const attachedFilePreviewTemp = [...attachedFilePreview].reverse().filter((_, index) => index !== idx);

    setAttachedFile(attachedFileTemp.reverse());
    setAttachedFilePreview(attachedFilePreviewTemp.reverse());
  }

  return (
    <Container className={type}>
      {errorImg ?
        <ErrorImg id='errorImg'>
          <ErrorNote>이미지 오류</ErrorNote>
        </ErrorImg>
        :
        <Image
          src={data.url}
          alt={data.name}
          objectFit='cover'
          fill
          onError={() => setErrorImg(true)}
        />
      }
      <FileInfo id='file'>
        <FileIconWrapper>
          {type === 'audio' &&
            <AudioIcon />
          }
          {type === 'video' &&
            <VideoIcon />
          }
        </FileIconWrapper>
        <p>{data.name}</p>
      </FileInfo>
      <DeleteButton
        id='deleteButton'
        onClick={handleDeleteItem}
      >
        <DeleteIcon />
      </DeleteButton>
    </Container>
  )
};
export default AttachedFilePreviewItem;

const Container = styled.div`
  flex-shrink: 0;
  display: inline-flex;
  position: relative;
  width: 68px;
  max-width: 200px;
  height: 72px;

  border-radius: 12px;
  cursor: pointer;

  &>img {
    border-radius: 12px;
  }

  &>#deleteButton {
    top: -8px;
    right: -8px;
  }

  &.image {
    border: 1px solid var(--bg-chat-message-file-border);

    &>#file {
      display: none;
    }
  }

  &:not(.image) {
    display: flex;
    width: auto;
    height: 54px;

    background-color: var(--bg-chat-message-file);

    &>img, &>#errorImg {
      display: none;
    }

    &>#deleteButton {
      top: -4px;
      right: -4px;
    }
  }

  &:hover #deleteButton{
    opacity: 1;
  }
`
const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.375rem;
  padding-right: 1.125rem;
  border: 1px solid var(--bg-chat-message-file-border);
  border-radius: 12px;

  &>p {
    color: var(--text-normal);
    font-size: 0.75rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }
`
const FileIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1/1;
  background-color: var(--bg-chat-message-file-thumb);
  border-radius: 8px;
`
const AudioIcon = styled(IconAudio)`
  width: 16px;
  height: 16px;

  opacity: 0.7;
  stroke: var(--text-normal);
`
const VideoIcon = styled(IconVideo)`
  width: 18px;
  height: 18px;

  opacity: 0.7;
  fill: var(--text-normal);
`
const DeleteButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 24px;
  height: 24px;
  
  border-radius: 100%;
  border: 1px solid #4e4e4e;
  background-color: #000e;
  opacity: 0;
  transition: 50ms;

  &:hover {
    border: 1px solid #c23b3b;
    background-color: var(--bg-chat-attached-delete-hover);
  }
`
const DeleteIcon = styled(IconDelete)`
  width: 9px;
  height: 9px;

  opacity: 1;
  stroke: #fff;
  stroke-width: 5;
`
const ErrorImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  border-radius: 12px;
`
const ErrorNote = styled.div`
  color: var(--bg-chat-prompt-disable-border);
  font-size: 0.625rem;
  text-align: center;

  user-select: none;
`


