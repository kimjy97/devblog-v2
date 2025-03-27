import React from "react";
import Code from "@components/Markdown/Code";
import Pre from "@components/Markdown/Pre";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  text: string;
}

const removeNewlineNodes = (children: React.ReactNode) => {
  if (Array.isArray(children)) {
    return children.filter(
      (child) => !(typeof child === "string" && child.trim() === "")
    );
  }
  return children;
};

// ✅ HTMLAttributes 추가해서 기본 속성들 다 받도록 설정
const CustomUl = (props: React.HTMLAttributes<HTMLUListElement>) => {
  const { children, ...rest } = props;
  return <ul {...rest}>{removeNewlineNodes(children)}</ul>;
};

const CustomOl = (props: React.HTMLAttributes<HTMLOListElement>) => {
  const { children, ...rest } = props;
  return <ol {...rest}>{removeNewlineNodes(children)}</ol>;
};

const CustomLi = (props: React.LiHTMLAttributes<HTMLLIElement>) => {
  const { children, ...rest } = props;
  return <li {...rest}>{removeNewlineNodes(children)}</li>;
};

const MarkdownViewer = ({ text }: Props) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      className="chat-assistant code-style"
      components={{
        pre: Pre,
        code: Code,
        ul: CustomUl,
        ol: CustomOl,
        li: CustomLi,
      }}
    >
      {text}
    </Markdown>
  );
};

export default MarkdownViewer;
