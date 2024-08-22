// 게시글 정보
export type PostInfo = {
  postId: number,
  name: string,
  title: string,
  description: string,
  tags: string[],
  content: string,
  time: string,
  date: string,
  like: number,
  cmtnum: number,
  view: number,
}