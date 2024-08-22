import { IChatArray, IChatAttacedFile, IChatContents } from "@/types/chat";
import { getFileTypeFromBase64 } from "@/utils/image";

/** 이모지 제거 */
export const removeEmojis = (text: string) => {
  return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map Symbols
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '');// Flags
};

/** 토큰 사용 : 로컬스토리지 생성 및 수정 */
export const usingToken = (model: string, token: number) => {
  const now = new Date();
  const expireTime = 8640000; // 1일 후 만료
  const storage = localStorage.getItem('usedToken');

  const addNewTokenSet = () => {
    const tokenObj = [{ model, token, expireTime: now.getTime() + expireTime }];
    localStorage.setItem('usedToken', JSON.stringify(tokenObj));
  }

  const handleToken = () => {
    if (storage) {
      const tokenObj = JSON.parse(storage);
      const index = tokenObj.findIndex((i: any) => i.model === model);

      // 토큰셋 생성
      const addTokenSet = () => {
        const tokenSet = {
          model,
          token,
          expireTime: tokenObj[index]?.expireTime ?? now.getTime() + expireTime
        };
        tokenObj.push(tokenSet);
      }

      // 토큰셋 초기화
      const resetTokenSet = () => {
        tokenObj[index].expireTime = now.getTime() + expireTime;
        tokenObj[index].token = token;
      }

      if (index >= 0) {
        if (now.getTime() > tokenObj[index].expireTime) {
          resetTokenSet();
        } else {
          tokenObj[index].token += token;
        }
      } else {
        addTokenSet();
      }
      localStorage.setItem('usedToken', JSON.stringify(tokenObj));
    } else {
      addNewTokenSet();
    }
  }

  handleToken();
}

/** 토큰 값 반환 : 로컬스토리지 불러오기 */
export const getToken = (model: string): number => {
  if (typeof window === 'undefined') return 0;
  const storage = localStorage.getItem('usedToken');
  let result = 0;
  if (storage) {
    const tokenObj = JSON.parse(storage);
    const index = tokenObj.findIndex((i: any) => i.model === model);
    if (index >= 0) {
      result = tokenObj[index]?.token ?? 0;
    }
  }
  return result;
}

/** 해당 모델의 토큰 진행률 반환 */
export const getProgress = (model: string, maxToken: number): number => {
  const per = (getToken(model) / maxToken) * 100;
  const result = per > 100 ? 100 : per;
  return result;
}

/** 문자열의 끝에 있는 줄바꿈 또는 공백 문자 제거 */
export const removeTrailingNewlines = (text: string) => {
  return text.replace(/\s+$/g, '');
}

/* FullPage Version */

/** 채팅 내용 로컬스토리지 저장 (Full Ver.) */
export const saveChatFull = (contents: IChatArray[]) => {
  let contentsTemp: IChatArray[] = contents.map(i => ({ ...i }));

  contentsTemp = contentsTemp.map((i: IChatArray) => {
    const chatContents = i.chatContents.map((j: IChatContents) => {
      const attachedFiles = j.attachedFiles?.map((k: IChatAttacedFile) => {
        return k.uri.split('/')[0] !== 'data:image'
          ? { ...k, uri: `${k.uri.split(',')[0]},` }
          : k;
      }) ?? j.attachedFiles;

      return { ...j, attachedFiles };
    });

    return { ...i, chatContents };
  });

  localStorage.setItem('AIChat_full', JSON.stringify(contentsTemp));
}

export const transformContetnsArr = (arr: any[]) => {
  const msgArr: any = {
    history: [],
    generationConfig: {
      maxOutputTokens: 1600,
    },
  };

  arr.slice(0, -1).forEach((i: any) => {
    const attachedArr: any[] = [];

    if (i.attachedFiles) {
      i.attachedFiles.forEach((j: any) => {
        attachedArr.push({
          inlineData: {
            data: j.uri.split(',')[1],
            mimeType: getFileTypeFromBase64(j.uri),
          }
        });
      });
    }

    msgArr.history.push({
      role: i.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: i.contents }, ...attachedArr]
    });
  });

  return msgArr;
}

/** 마크다운 문자 제거 */
export const removeMarkdown = (text: string): string => {
  // 정규 표현식을 사용하여 마크다운 문법을 제거합니다.
  return text
    // 헤딩
    .replace(/#{1,6}\s*/g, '')
    // 볼드체
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // 이탤릭체
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // 취소선
    .replace(/~~(.*?)~~/g, '$1')
    // 링크
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // 이미지
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    // 인라인 코드
    .replace(/`(.*?)`/g, '$1')
    // 코드 블록
    .replace(/```[\s\S]*?```/g, '')
    // 블록 인용
    .replace(/>\s?/g, '')
    // 목록
    .replace(/^\s*[*\-+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 수평선
    .replace(/^\s*([-*_]){3,}\s*$/gm, '')
    // 엔터를 줄 바꿈으로 대체
    .replace(/\n{2,}/g, '\n\n');
}

/** 한국어 포함 여부 */
export const hasKorean = (text: string): boolean => {
  const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
  let koreanCharCount = 0;

  for (let i = 0; i < text.length; i++) {
    if (koreanRegex.test(text[i])) {
      koreanCharCount++;
    }
  }

  const threshold = text.length * 0.1;
  return koreanCharCount >= threshold;
}
