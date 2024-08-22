import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI CHAT 🔮",
  description: "AI 챗봇 서비스입니다. 빠른 응답 속도와 다양한 기능들을 제공합니다.",
};

const PostLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
}

export default PostLayout;