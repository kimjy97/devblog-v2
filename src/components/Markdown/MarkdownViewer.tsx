import Code from "@components/Markdown/Code";
import Pre from "@components/Markdown/Pre";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  text: string;
}

const MarkdownViewer = ({ text }: Props) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      className='chat-assistant code-style'
      components={{
        pre: Pre,
        code: Code,
      }}
    >
      {text}
    </Markdown>
  );
}

export default MarkdownViewer;