import styled from "styled-components"
import IconProfile from '@public/svgs/profile.svg';
import IconAI from '@public/svgs/ai.svg';
import MarkdownViewer from "@/components/Markdown/MarkdownViewer";
import Image from "next/image";
import IconAudio from '@public/svgs/audio.svg';
import IconAudioOn from '@public/svgs/audio_on.svg';
import IconVideo from '@public/svgs/video.svg';
import { getFileTypeFromBase64 } from "@/utils/image";
import { useEffect, useRef, useState } from "react";
import Tooltip from "@/components/Tooltip";
import LottieBox from "@/components/LottieBox";
import useToast from "@/hooks/useToast";
import CopyAni from '@lotties/copy.json';
import { useRecoilValue } from "recoil";
import { currentChatIdState } from "@/atoms/chatAI";
import LoadingMessage from "@/containers/AIChatFull/Contents/LoadingMessage";
import { apiPost } from "@/services/api";

const Message = ({ data }: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageRef = useRef<any>(null);
  const currentChatId = useRecoilValue(currentChatIdState);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const { addToast } = useToast();
  const attached = data.attachedFiles;
  const type = (idx: number) =>
    attached?.length > 0 && getFileTypeFromBase64(attached[idx].uri).split('/')[0];

  const handleClickAudio = async (text: string) => {
    if (!audioUrl) {
      setIsAudioLoading(true);
      await handleGenerateVoice(text).then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
      });
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleGenerateVoice = async (text: string) => {
    await apiPost('/api/tts', { text })
      .then(res => setAudioUrl(`data:audio/mpeg;base64,${res.url}`))
      .catch()
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleCopyToClipboard = async (text: string) => {
    setIsCopy(true);
    try {
      await navigator.clipboard.writeText(text);
      // addToast({ value: '코드가 복사되었습니다.' });
    } catch {
      addToast({ type: 1, value: '복사에 실패했습니다.' });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (messageRef.current && !!data.done) {
      messageRef.current.style.opacity = 1;
      messageRef.current.style.transform = 'translateY(0px)';
    }
  }, [currentChatId])

  // 사용자 메시지 컴포넌트
  if (data.role === 'user')
    return (
      <MessageUser ref={messageRef}>
        <ProfileImg className='user'>
          <ProfileIcon />
        </ProfileImg>
        <UserMessageContents>
          {attached.length > 0 ?
            attached.length === 1 ?
              <AttachedFilePreview className={`single ${type(0) !== 'image' ? 'file' : ''}`}>
                {type(0) !== 'image' ?
                  <FileContainer>
                    <FileWrapper>
                      <FileIconWrapper>
                        {type(0) === 'audio' &&
                          <AudioIcon />
                        }
                        {type(0) === 'video' &&
                          <VideoIcon />
                        }
                      </FileIconWrapper>
                      <p>{attached[0].name}</p>
                    </FileWrapper>
                  </FileContainer>
                  :
                  <ImageWrapper className="single">
                    <Image
                      src={attached[0].uri}
                      alt={attached[0].name}
                      fill
                      objectFit="contain"
                    />
                  </ImageWrapper>
                }
              </AttachedFilePreview>
              :
              <AttachedFilePreview className="grid">
                {attached.map((i: any, idx: number) =>
                  <FileContainer key={idx}>
                    <FileWrapper>
                      {type(idx) !== 'image' ?
                        <FileIconWrapper>
                          {type(idx) === 'audio' &&
                            <AudioIcon />
                          }
                          {type(idx) === 'video' &&
                            <VideoIcon />
                          }
                        </FileIconWrapper>
                        :
                        <ImageWrapper>
                          <Image
                            src={i.uri}
                            alt={i.name}
                            fill
                            objectFit="contain"
                          />
                        </ImageWrapper>
                      }
                      <p>{i.name}</p>
                    </FileWrapper>
                  </FileContainer>
                )}
              </ AttachedFilePreview>
            : null
          }
          <p>{data.contents}</p>
        </UserMessageContents>
      </MessageUser>
    )
  if (data.role === 'assistant')
    // 어시스턴트 메시지 컴포넌트
    return (
      <MessageAssistant ref={messageRef}>
        <ProfileImg className='assistant'>
          <AIIcon />
        </ProfileImg>
        <MessageContents>
          {data.contents ?
            <MarkdownViewer text={data.contents} />
            :
            <MessageLoading />
          }
          <OptionWrapper className={data.done && data.contents ? '' : 'invisible'}>
            <Result className={data.contents.slice(-14) === '...***(중단됨)***' ? 'stop' : ''}>{data.contents.slice(-14) === '...***(중단됨)***' ? 'ERROR' : 'DONE'}</Result>
            {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnd} />}
            <Tooltip ct={isPlaying ? '정지' : '재생'} delay={250}>
              <AudioPlayer onClick={() => handleClickAudio(data.contents)}>
                <Icon>
                  {isAudioLoading ?
                    <LoadingCircle /> : isPlaying ?
                      <AudioOffIcon><div /></AudioOffIcon> : <AudioOnIcon />
                  }
                </Icon>
              </AudioPlayer>
            </Tooltip>
            <Tooltip ct='복사' delay={250}>
              <CopyBtn onClick={() => handleCopyToClipboard(data.contents)}>
                <Icon>
                  <Clipborad>
                    <LottieBox
                      json={CopyAni}
                      play={isCopy}
                      speed={1.2}
                      onComplete={() => { setIsCopy(false) }}
                      boxStyle={{ width: 16, height: 16 }}
                      style={{ width: 20, height: 20 }}
                    />
                  </Clipborad>
                </Icon>
              </CopyBtn>
            </Tooltip>
          </OptionWrapper>
          <LoadingMessage visible={!data.done} />
        </MessageContents>
      </MessageAssistant>
    )
}

export default Message;

const ProfileImg = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  aspect-ratio: 1/1;
  
  background-color: transparent;
  border-radius: 100%;
  overflow: hidden;
  
  &.user {
    transform: scale(0.96);
    margin-top: 0.5rem;
    background-color: var(--bg-chat-profile-background);
  }

  &.assistant {
    transform: scale(0.85);
  }

  @media (max-width: 1280px) {
    display: none;
  }
`
const ProfileIcon = styled(IconProfile)`
  width: 22px;
  aspect-ratio: 1/1;
  margin-bottom: -9px;

  overflow: hidden;
  fill: var(--bg-chat-profile);
  transform: scaleX(1.1);

  transition: 150ms;

  @media (max-width: 1280px) {
    width: 22px;
    margin-bottom: -6px;
  }
`
const AIIcon = styled(IconAI)`
  width: 30px;
  height: 30px;

  @media (max-width: 1280px) {
    width: 24px;
  }
`
const MessageContents = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
  flex: 1;
  white-space: pre-line;
  color: var(--text-normal);

  transition: 150ms;

  @media (max-width: 1280px) {
    flex: initial;
    width: auto;
    align-self: flex-start;
    max-width: calc(100% - 3rem);
    padding: 1.25rem 1.5rem;
    padding-bottom: 0.5rem;

    border-radius: 16px;
    background-color: var(--bg-chat-message-mobile);
    border: 1px solid var(--bg-chat-message-border);
  }

  @media (max-width: 768px) {
    min-width: 50%;
    max-width: calc(100% - 2rem);
    padding: 1.125rem 1.25rem;
    padding-bottom: 0.5rem;
  }
`
const UserMessageContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0.75rem 1.125rem;
  max-width: calc(100% - 62px);

  background-color: var(--bg-chat);
  border-radius: 16px;

  white-space: pre-line;
  color: var(--text-normal);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;

  transition: 150ms;

  @media (max-width: 1280px) {
      max-width: 85%;
      
      background-color: var(--bg-chat-message-user-mobile);

      color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`
const MessageUser = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 22px;
  padding-bottom: 2.25rem;

  opacity: 0;
  transform: translateY(20px);
  
  animation: 300ms 0ms slideUpAni forwards;

  @media (max-width: 1280px) {
    justify-content: flex-end;
    padding-bottom: 1.25rem;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @keyframes slideUpAni {
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`
const MessageAssistant = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 22px;
  padding-bottom: 42px;
  transform: translateY(20px);

  opacity: 0;

  animation: 300ms 300ms slideUpAni forwards;

  &:last-child {
    padding-bottom: 32px;
  }

  @keyframes slideUpAni {
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`
const AttachedFilePreview = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  width: 504px;

  border-radius: 8px;

  &.grid {
    margin: 8px 0;
  }

  &.single {
    width: 240px;
    margin: 8px 0;

    &.file {
      width: 160px;
    }
  }

  @media (max-width: 768px) {
    width: 248px;
  }
`
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;

  overflow: hidden;
  background-image: linear-gradient(45deg, var(--bg-chat-message-img1) 25%, transparent 25%), 
                    linear-gradient(-45deg, var(--bg-chat-message-img1) 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, var(--bg-chat-message-img1) 75%), 
                    linear-gradient(-45deg, transparent 75%, var(--bg-chat-message-img1) 75%);
  background-size: 24px 24px;
  background-position: 0 0, 0 12px, 12px -12px, -12px 0px;

  &.single {
    background-image: linear-gradient(45deg, var(--bg-chat-message-img2) 25%, transparent 25%), 
                      linear-gradient(-45deg, var(--bg-chat-message-img2) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, var(--bg-chat-message-img2) 75%), 
                      linear-gradient(-45deg, transparent 75%, var(--bg-chat-message-img2) 75%);
  }
`
const FileContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`
const FileWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  padding-bottom: 0.75rem;

  border: 1px solid var(--bg-chat-message-file-border);
  border-radius: 12px;
  background-color: var(--bg-chat-message-file);

  &>p {
    flex: 1;
    padding: 0 0.25rem;

    color: var(--text-normal);
    font-size: 0.75rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }
`
const FileIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1/1;

  background-color: var(--bg-chat-message-file-thumb);
  border-radius: 8px;
`
const AudioIcon = styled(IconAudio)`
  width: 32px;
  height: 32px;

  opacity: 0.7;
  stroke: var(--text-normal);
`
const VideoIcon = styled(IconVideo)`
  width: 36px;
  height: 36px;

  opacity: 0.7;
  fill: var(--text-normal);
`
const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1.25rem;
  gap: 1.125em;

  opacity: 1;
  transform: translateY(0px);
  transition: 500ms cubic-bezier(0.23, 1, 0.320, 1);

  #tooltip {
    z-index: 0 !important;
  }

  &.invisible {
    opacity: 0;
    transform: translateY(1.25em);
  }

  @media (max-width: 768px) {
  }

  @keyframes fadeInAni {
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`
const AudioPlayer = styled.div`
  cursor: pointer;
`;
const Icon = styled.div`
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 36px;

  background-color: transparent;
  border-radius: 100%;

  &>*:first-child {
    opacity: 0.4;
    transition: 100ms;
    will-change: transform;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;

    background-color: transparent;
    border-radius: 100%;
    transition: 100ms;
  }

  &:hover {
    &::before {
      background-color: var(--bg-chat-message-icon-hover);
    }

    &>*:first-child {
      opacity: 1;
      transform: scale(1.15);
    }
  }
`
const AudioOnIcon = styled(IconAudioOn)`
  width: 16px;
  height: 16px;

  fill: var(--text-normal);
`
const AudioOffIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 100%;
  
  z-index: 100;
  
  &>div {
    width: 9px;
    height: 9px;

    border-radius: 1px;
    background-color: var(--text-normal);
  }
`
const LoadingCircle = styled.div`
  width: 18px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid var(--text-normal);
  animation:
    l20-1 0.8s infinite linear alternate,
    l20-2 1.6s infinite linear;
  @keyframes l20-1{
    0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
    12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
    25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
    50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
    100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
  }
  @keyframes l20-2{ 
    0%    {transform:scaleY(1)  rotate(0deg)}
    49.99%{transform:scaleY(1)  rotate(135deg)}
    50%   {transform:scaleY(-1) rotate(0deg)}
    100%  {transform:scaleY(-1) rotate(-135deg)}
  }
`
const CopyBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;

  cursor: pointer;
`
const Clipborad = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: 150ms;

  filter: var(--filter-invert-reverse);
`
const MessageLoading = styled.div`
  display: flex;
  align-items: center;
  height: 1.5em;
  padding-left: 0.375em;
  div {
    width: 1.875em;
    aspect-ratio: 6;
    
    --_g: no-repeat radial-gradient(circle closest-side, var(--text-normal) 100%, #0000);
    background: 
      var(--_g) 0%   50%,
      var(--_g) 50%  50%,
      var(--_g) 100% 50%;
    background-size: calc(100%/3) 100%;
    opacity: 0.25;

    animation: l7 1s infinite linear;

    @keyframes l7 {
        33%{background-size:calc(100%/3) 0%  ,calc(100%/3) 100%,calc(100%/3) 100%}
        50%{background-size:calc(100%/3) 100%,calc(100%/3) 0%  ,calc(100%/3) 100%}
        66%{background-size:calc(100%/3) 100%,calc(100%/3) 100%,calc(100%/3) 0%  }
    }
  }
  
`
const Result = styled.div`
  color: var(--text-sub-light);
  font-size: 0.75rem;
  user-select: none;

  &.stop {
    color: var(--text-red);
  }

  @media (max-width: 768px) {
  }
`