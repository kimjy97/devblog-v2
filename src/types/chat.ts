export interface IChatAttacedFile {
  uri: string,
  name: string,
}

export interface IChatContents {
  role: string,
  contents: string,
  done?: boolean,
  attachedFiles?: IChatAttacedFile[],
}

export interface IChatArray {
  chatId: number,
  chatName: string,
  chatContents: IChatContents[],
  chatDate: Date,
}