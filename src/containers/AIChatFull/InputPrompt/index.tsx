import { chatInputState } from '@/atoms/chat';
import LottieBox from '@/components/LottieBox';
import { useChatEffect, useChatFastStart, useResizeChatInput } from '@/hooks/useChatInput';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled, { keyframes } from 'styled-components';
import aiIconAni from '@lotties/ai2.json';
import IconSend from '@public/svgs/send.svg';
import IconAttach from '@public/svgs/attachment.svg';
import { pageLoadingState } from '@/atoms/pageLoading';
import useToast from '@/hooks/useToast';
import AttachedFilePreview from '@containers/AIChatFull/InputPrompt/AttachedFilePreview';
import { attachedFilePreviewState, attachedFileState, chatArrState, isResponsingState, requestPromptState } from '@atoms/chatAI';
import { getToken } from '@/utils/chat';
import { contentsWidth, modelArr } from '@/constants/chat';
import { resizeImage } from '@/utils/image';
import { IChatArray } from '@/types/chat';

export interface IAttachedFilePreview {
  name: string;
  url: string;
  type: string;
}

export const inputLineHeight: string = '1.625rem';
export const paddingVertical: string = '0.875rem';

const InputPrompt = (): JSX.Element => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
  const isPageLoading = useRecoilValue(pageLoadingState);
  const [chatArr, setChatArr] = useRecoilState(chatArrState);
  const [chatInput, setChatInput] = useRecoilState(chatInputState);
  const [requestPrompt, setRequestPrompt] = useRecoilState(requestPromptState);
  const [attachedFile, setAttachedFile] = useRecoilState(attachedFileState);
  const [attachedFilePreview, setAttachedFilePreview] = useRecoilState(attachedFilePreviewState);
  const [isResponsing, setIsResponsing] = useRecoilState(isResponsingState);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>("'Enter' 키를 누르면 메시지 입력이 시작됩니다.");
  const [tokenPercent, setTokenPercent] = useState<number>(0);
  const attachButtonClass = !(attachedFile.length > 0) ? 'empty' : '';
  const sendButtonClass = (!chatInput.trim() && !isResponsing) ? 'disable' : isResponsing ? 'responsing' : '';
  const visibleClass = !isPageLoading ? 'visible' : '';
  const inputClass = tokenPercent >= 1 ? 'disable' : '';
  const { addToast } = useToast();
  useResizeChatInput(chatInput, textAreaRef.current)
  useChatEffect(chatInput, setIsTyping, setIsPulsing);
  useChatFastStart(textAreaRef.current);
  const chatNote = '해당 AI 모델은 정확하지 않은 정보와 실제와 다른 정보를 제공할 수 있습니다.';

  const handleFileUpload = () => {
    attachInputRef.current?.click();
  }

  const handleAttachFile = (e: any) => {
    const fileArr = e.target.files;
    const totalFiles = attachedFile.length + fileArr.length;

    if (totalFiles > 15) {
      addToast({ type: 1, value: '파일은 최대 15개만 첨부할 수 있습니다.' });
      return;
    }

    setAttachedFile((prevFiles: any) => [...prevFiles, ...Array.from(fileArr)]);

    const attachedList = attachedFilePreview ? [...attachedFilePreview] : [];

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      const url = URL.createObjectURL(file);
      const type = file.type;
      const name = file.name;
      attachedList.push({ name, url, type });
    }

    setAttachedFilePreview(attachedList);
  };

  const handleEnterInput = (e: any) => {
    // 브라우저 너비가 768px 이하일 경우 함수를 즉시 종료
    if (window.innerWidth <= 768) {
      return;
    }

    const trimPrompt = chatInput.trim();

    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }

    if (e.key === 'Enter' && !isSend && trimPrompt) {
      handleSendMessage();
      setIsSend(true);
    }
  }

  const handleContentsDone = () => {
    const tempArr: IChatArray[] = chatArr.map((chat: IChatArray) => ({
      ...chat,
      chatContents: chat.chatContents.map(content => ({
        ...content,
        contents: content.done ? content.contents : content.contents + (content.role === 'assistant' ? ' ...***(중단됨)***' : ''),
        done: true
      }))
    }));

    setChatArr(tempArr);
  }

  const handleSendMessage = async () => {
    if (isResponsing) {
      setIsResponsing(false);
      handleContentsDone();
      return;
    }

    let mediaParts: any = [];
    mediaParts.push(chatInput);

    if (attachedFile.length > 0) {
      const filePromises = attachedFile.map(async (i: any) => {
        const file = i;
        const reader = new FileReader();

        return new Promise<void>((resolve) => {
          reader.readAsDataURL(file);
          reader.onload = async () => {
            if (typeof reader.result === 'string') {
              const resized = file.type.split('/')[0] === 'image' ? await resizeImage(reader.result) : '';
              const obj = {
                origin: {
                  uri: file.type.split('/')[0] === 'image' ? resized : reader.result,
                  name: file.name,
                },
                body: {
                  inlineData: {
                    data: file.type.split('/')[0] === 'image' ? resized.split(',')[1] : reader.result.split(',')[1],
                    mimeType: file.type,
                  },
                },
              };
              mediaParts = [...mediaParts, obj];
              resolve();
            }
          };
        });
      });

      await Promise.all(filePromises);
      if (!isResponsing) {
        setRequestPrompt([...mediaParts]);
        setChatInput('');
      }
    }

    if (!isResponsing && attachedFile.length === 0) {
      setRequestPrompt([chatInput]);
      setChatInput('');
    }
  }

  useEffect(() => {
    if (!requestPrompt) {
      setIsSend(false);
      setAttachedFilePreview([]);
      setAttachedFile([]);
    }
  }, [requestPrompt])

  useEffect(() => {
    setInputPlaceholder(tokenPercent >= 1 ? "사용할 수 있는 토큰을 모두 사용했습니다. 토큰은 내일 초기화 됩니다." : "'Enter' 키를 누르면 메시지 입력이 시작됩니다.");
  }, [tokenPercent])

  useEffect(() => {
    setTokenPercent(getToken(modelArr[0].model) / modelArr[0].maxToken);
  }, [])

  return (
    <Container>
      <Wrapper
        className={visibleClass}
        $isTyping={isTyping}
        $isPulsing={isPulsing}
      >
        <Note className={visibleClass}>
          {chatNote}
        </Note>
        <LottieBox
          id='aiIcon'
          json={aiIconAni}
          boxStyle={{
            width: '52px',
            height: '52px',
            minWidth: '52px',
            filter: isPulsing ? 'brightness(120%)' : 'brightness(98%)'
          }}
          style={{
            width: '110%',
            height: '110%',
          }}
          speed={isTyping ? 2.3 : 0.9}
          play
          loop
        />
        <InputWrapper className={inputClass}>
          <AttachedFilePreview data={attachedFilePreview} />
          <Input
            value={chatInput}
            ref={textAreaRef}
            rows={1}
            autoSave='off'
            autoComplete='off'
            placeholder={inputPlaceholder}
            disabled={isSend || tokenPercent >= 1}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => handleEnterInput(e)}
          />
        </InputWrapper>
        <InputButtonWrapper>
          <AttachInput
            ref={attachInputRef}
            type='file'
            accept="image/*, audio/*"
            multiple
            onChange={e => handleAttachFile(e)}
          />
          <AttachButton
            className={attachButtonClass}
            onClick={handleFileUpload}
          >
            <AttachIcon />
          </AttachButton>
          <SendButton
            className={sendButtonClass}
            onClick={handleSendMessage}
          >
            <Loader>
              <div className='ani' />
              <div className='stop' />
            </Loader>
            <SendIcon />
          </SendButton>
        </InputButtonWrapper>
      </Wrapper>
    </Container>
  )
};

export default InputPrompt;

const InputSlideUpAni = keyframes`
  100%{
    transform: translateY(0%);
    margin-bottom: 0;
    opacity: 1;
  }
`
const NoteFadeInAni = keyframes`
  100%{
    opacity: 0.4;
  }
`
const Container = styled.div`
`
const Wrapper = styled.div<{ $isTyping: boolean, $isPulsing: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-bottom: 30px;
  width: calc(100% - 2rem);
  max-width: ${contentsWidth};
  min-width: 900px;
  margin: 0 auto;
  transform: translateY(100%);

  opacity: 1;
  //box-shadow: 0 -20px 45px 25px var(--bg-body);

  transition: 150ms;

  &.visible {
    animation: ${InputSlideUpAni} 300ms 150ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  }

  #aiIcon {
    transform: ${({ $isTyping }) => $isTyping ? 'scale(1.25)' : 'scale(1.1)'} !important;
    filter: saturate(2) ${({ $isPulsing }) => $isPulsing ? 'brightness(115%)' : 'brightness(98%)'} !important;
    transition: filter 550ms cubic-bezier(0.23, 1, 0.320, 1), transform 200ms;
  }

  @media (max-width: 1280px) {
    width: calc(100% - 2rem);
    max-width: 100%;
    min-width: auto;
    #aiIcon {
      display: none;
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 1rem);
  }
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${paddingVertical} 0px;
  padding-left: 1.375rem;
  padding-right: 1.375rem;

  background-color: var(--bg-chat);
  box-shadow: var(--bg-chat-prompt-boxshadow);
  border-radius: 30px;
  border: 1px solid transparent;
  overflow: hidden;

  transition: 150ms;

  &.disable {
    border-color: var(--bg-chat-prompt-disable-border);

    &>textarea::placeholder {
      text-align: center;
      color: var(--bg-chat-prompt-disable-border);
    }
    &+div {
      display: none;
    }
  }

  @media (max-width: 1280px) {
    border-radius: 14px !important;
  }
`
const Input = styled.textarea`
  height: ${inputLineHeight};
  margin-right: 66px;
  
  background-color: transparent;
  border: none;
  border-radius: 0;
  resize: none;
  overflow: hidden;

  color: var(--text-normal);
  font-size: 1rem;
  line-height: ${inputLineHeight};
  overscroll-behavior: contain;

  transition: 150ms, height 0ms;

  &:focus::placeholder {
      color: transparent;
  }
  &:placeholder-shown {
    text-overflow: ellipsis;
  }
  &::placeholder {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--text-chat-prompt-placeholder);
    user-select: none;
  }
  &::-webkit-scrollbar {
    width: 14px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    height: 50%;
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
const InputButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 31px;
  right: 14px;
  height: calc(${paddingVertical} + ${paddingVertical} + ${inputLineHeight});
`
const SendButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  
  transition: 150ms;
  cursor: pointer;

  svg {
    opacity: 1;
    transition: 150ms;
  }

  div {
    opacity: 0;
    transition: 150ms;
  }

  &.disable {
    cursor: default;

    svg {
      opacity: 0.4;
      transition: none;
    }
  }

  &.responsing {
    svg {
      opacity: 0;
    }
    div {
      opacity: 1;
    }
  }

  &:not(.disable):has(:not(.ani)):hover {
    transform: scale(1.15);
  }
`
const SendIcon = styled(IconSend)`
  width: 20px;
  height: 20px;

  fill: var(--bg-chat-send-icon);
  transition: 150ms;
`
const AttachButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;

  cursor: pointer;
  transition: 150ms;

  &.empty {
    opacity: 0.4;
  }

  &:hover {
    transform: scale(1.15);
    &.empty {
      opacity: 0.55;
    }
  }
`
const AttachInput = styled.input`
  display: none;
`
const AttachIcon = styled(IconAttach)`
  width: 20px;
  height: 20px;

  stroke: var(--text-normal);
  transition: 150ms;
`

const Note = styled.div`
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 8px;
  
  opacity: 0;
  
  color: var(--text-normal);
  font-size: 0.75rem;
  font-weight: 400;
  text-align: center;
  
  transform: translateX(-50%);
  transition: 150ms;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;

  &.visible {
    animation: ${NoteFadeInAni} 250ms 380ms ease-out forwards;
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`
const Loader = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;

  & .ani {
    width: 32px;
    aspect-ratio: 1/1;
    display: inline-block;
    position: relative;
    
    border-radius: 50%;
    background: linear-gradient(0deg, rgba(183, 183, 232, 0.3) 33%, #ffffff 100%);
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    opacity: 0.4;

    &::before {
      content: '';  
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bg-chat);
    }

    @keyframes rotation {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg)}
    }
  }

  & .stop {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    aspect-ratio: 1/1;

    border-radius: 1px;
    background-color: var(--text-normal);
  }
`

