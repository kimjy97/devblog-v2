import { IChatContents } from '@/types/chat';

interface Message {
  role: string;
  content: string | any[];
}

interface RequestOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion(
    messages: Message[],
    options: RequestOptions = {}
  ): Promise<Response> {
    const requestBody: any = {
      model: options.model || process.env.NEXT_PUBLIC_OPENROUTER_MODEL,
      messages,
      temperature: options.temperature || 0.7,
      // max_tokens 값을 더 작게 설정하여 크레딧 소모를 줄임
      max_tokens: options.max_tokens || 1024,
      stream: options.stream || false,
      ...options,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        // 애플리케이션 정보 헤더
        "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "https://kimjy.vercel.app",
        "X-Title": "Dev Blog AI Chat"
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // 에러 응답 본문 확인
      const errorText = await response.text();

      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response;
  }

  async chatCompletionStream(
    messages: Message[],
    options: RequestOptions = {}
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await this.chatCompletion(messages, { ...options, stream: true });
    return response.body!;
  }
}

// OpenRouter API를 사용하여 스트리밍 응답을 처리하는 함수
export const sendMessageStream = async (
  chatHistory: IChatContents[],
  apiKey: string,
  model: string,
  onUpdate: (chunk: string) => void,
  onFinish?: (fullResponse: string) => void
) => {
  const client = new OpenRouterClient(apiKey);

  // 기존 채팅 내역을 OpenRouter 형식에 맞게 변환
  const formattedMessages = chatHistory.map((msg) => {
    let content: any = "";

    if (typeof msg.contents === 'string') {
      content = msg.contents;
    }
    
    if (Array.isArray(msg.contents)) {
      // 여러 파트로 구성된 경우, OpenRouter 형식에 맞게 처리
      const processedParts = msg.contents.map((part: any) => {
        if (typeof part === 'string') {
          return { type: 'text', text: part };
        }
        
        if (part.text) {
          return { type: part.text, text: part.text };
        }
        
        if (part.inlineData) {
          // OpenRouter는 base64 이미지 URL을 직접 허용하지 않을 수 있으므로, 대안으로 처리
          return {
            type: 'image_url',
            image_url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          };
        }
        return { type: 'text', text: '' };
      }).filter((part: any) => part.text || part.image_url);

      // 만약 여러 파트가 있다면, content를 배열로 설정
      if (processedParts.length === 1 && processedParts[0].type === 'text') {
        content = processedParts[0].text;
      }

      if (processedParts.length !== 1 || processedParts[0].type !== 'text') {
        content = processedParts;
      }
    }

    // attachedFiles가 있는 경우, 이미지 파일을 content에 추가
    if (msg.attachedFiles && Array.isArray(msg.attachedFiles) && msg.attachedFiles.length > 0) {
      const attachedContent = msg.attachedFiles.map((file: any) => {
        if (file.uri && file.uri.startsWith('data:')) {
          return {
            type: 'image_url',
            image_url: file.uri
          };
        }
        return { type: 'text', text: file.name || '' };
      }).filter((part: any) => part.image_url || part.text);

      if (typeof content === 'string' && attachedContent.length > 0) {
        // 기존 콘텐츠가 문자열인 경우, 배열로 변환하고 첨부 파일 추가
        content = [{ type: 'text', text: content }, ...attachedContent].filter(part => part.text || part.image_url);
      } else if (Array.isArray(content)) {
        // 기존 콘텐츠가 배열인 경우, 첨부 파일 추가
        content = [...content, ...attachedContent];
      } else if (attachedContent.length > 0) {
        // content가 빈 경우 첨부 파일만 추가
        content = attachedContent;
      }
    }

    return {
      role: msg.role,
      content,
    };
  });

  const response = await client.chatCompletion(
    formattedMessages,
    {
      model,
      stream: true
    }
  );

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  let done = false;
  while (!done) {
    const result = await reader.read(); // eslint-disable-line no-await-in-loop
    done = result.done;
    if (result.done) break;
    const value = result.value;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // 마지막 줄은 불완전할 수 있으므로 다시 버퍼에 저장

    for (const line of lines) {
      if (line.trim() !== '') {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // 'data: ' 부분 제거

          if (data === '[DONE]') {
            if (onFinish) {
              // 스트림 완료 시 처리 - 여기에서 이미지 데이터를 적절히 처리해야 함
              onFinish(buffer);
            }
            return;
          }

          const parsed = JSON.parse(data);
          const choice = parsed.choices?.[0];

          if (choice) {
            // 텍스트 콘텐츠 처리
            const content = choice.delta?.content;
            if (content && typeof content === 'string' && content.length > 0) {
              onUpdate(content);
            }

            // 이미지 콘텐츠 처리
            const images = choice.delta?.images;
            if (images && Array.isArray(images)) {
              images.forEach(image => {
                if (image.image_url && image.image_url.url) {
                  // 이미지 URL을 적절한 형식으로 변환하여 전달
                  onUpdate(JSON.stringify({ type: 'image', url: image.image_url.url }));
                }
              });
            }
          }
        }
      }
    }
  }
  reader.releaseLock();
};

// OpenRouter API를 사용하여 일반 응답을 받는 함수
export const sendMessage = async (
  chatHistory: IChatContents[],
  apiKey: string,
  model: string
): Promise<string> => {
  const client = new OpenRouterClient(apiKey);

  // 기존 채팅 내역을 OpenRouter 형식에 맞게 변환
  const formattedMessages = chatHistory.map((msg) => {
    let content: any = "";

    if (typeof msg.contents === 'string') {
      content = msg.contents;
    }
    
    if (Array.isArray(msg.contents)) {
      // 여러 파트로 구성된 경우, OpenRouter 형식에 맞게 처리
      const processedParts = msg.contents.map((part: any) => {
        if (typeof part === 'string') {
          return { type: 'text', text: part };
        }
        
        if (part.text) {
          return { type: part.text, text: part.text };
        }
        
        if (part.inlineData) {
          return {
            type: 'image_url',
            image_url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          };
        }
        return { type: 'text', text: '' };
      }).filter((part: any) => part.text || part.image_url);

      if (processedParts.length === 1 && processedParts[0].type === 'text') {
        content = processedParts[0].text;
      }

      if (processedParts.length !== 1 || processedParts[0].type !== 'text') {
        content = processedParts;
      }
    }

    // attachedFiles가 있는 경우, 이미지 파일을 content에 추가
    if (msg.attachedFiles && Array.isArray(msg.attachedFiles) && msg.attachedFiles.length > 0) {
      const attachedContent = msg.attachedFiles.map((file: any) => {
        if (file.uri && file.uri.startsWith('data:')) {
          return {
            type: 'image_url',
            image_url: file.uri
          };
        }
        return { type: 'text', text: file.name || '' };
      }).filter((part: any) => part.image_url || part.text);

      if (typeof content === 'string' && attachedContent.length > 0) {
        // 기존 콘텐츠가 문자열인 경우, 배열로 변환하고 첨부 파일 추가
        content = [{ type: 'text', text: content }, ...attachedContent].filter(part => part.text || part.image_url);
      } else if (Array.isArray(content)) {
        // 기존 콘텐츠가 배열인 경우, 첨부 파일 추가
        content = [...content, ...attachedContent];
      } else if (attachedContent.length > 0) {
        // content가 빈 경우 첨부 파일만 추가
        content = attachedContent;
      }
    }

    return {
      role: msg.role,
      content,
    };
  });

  const response = await client.chatCompletion(formattedMessages, { model });
  const data = await response.json();

  return data.choices?.[0]?.message?.content || "";
}

// OpenRouter API를 사용하여 채팅 제목을 생성하는 함수
export const generateChatTitle = async (
  chatHistory: IChatContents[],
  apiKey: string,
  model: string
): Promise<string> => {
  // 채팅 기록에서 사용자와 AI의 첫 번째, 두 번째 메시지를 추출
  const userMessages = chatHistory.filter(msg => msg.role === 'user').slice(0, 2);
  const assistantMessages = chatHistory.filter(msg => msg.role === 'assistant').slice(0, 2);

  // 제목 생성을 위한 프롬프트 구성
  let titlePrompt = `다음 대화 내용을 바탕으로 간결하고 적절한 채팅 제목을 15자 이내로 생성해주세요. 
  응답은 반드시 제목 자체만을 출력해 주세요. 
  제목 외에는 아무 것도 포함하지 마세요. 
  특수 문자나 추가 설명, 줄바꿈 등을 포함하지 말고 오직 제목 내용만을 출력해 주세요.

  대화 내용:
  `;

  userMessages.forEach((msg, index) => {
    titlePrompt += `사용자 메시지 ${index + 1}: ${typeof msg.contents === 'string' ? msg.contents.substring(0, 100) : JSON.stringify(msg.contents).substring(0, 100)}\n`;
  });

  assistantMessages.forEach((msg, index) => {
    titlePrompt += `AI 응답 ${index + 1}: ${typeof msg.contents === 'string' ? msg.contents.substring(0, 100) : JSON.stringify(msg.contents).substring(0, 100)}\n`;
  });

  titlePrompt += "\n\n채팅 제목:";

  // 제목 생성 요청
  const titleResponse = await sendMessage([
    { role: 'user', contents: titlePrompt, done: true }
  ], apiKey, model);

  // 응답에서 제목 추출 (줄 바꿈 및 여분의 텍스트 제거)
  const extractedTitle = titleResponse.trim().split('\n')[0].substring(0, 15);

  // 응답이 너무 길 경우 줄임표 추가
  return extractedTitle.length <= 15
    ? extractedTitle
    : `${extractedTitle.substring(0, 12)}...`;
}