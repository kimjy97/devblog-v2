export interface IChatAttacedFile {
  uri: string,
  name: string,
}

export type IChatContentsType = (string | { mimeType: string, data: string })[] | string;

export interface IChatContents {
  role: 'user' | 'assistant';
  contents: IChatContentsType;
  attachedFiles?: any[];
  done: boolean;
}

export interface IChatArray {
  chatId: number;
  chatName: string;
  chatContents: IChatContents[];
  chatDate: Date;
}