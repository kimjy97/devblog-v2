import Code from "@components/Markdown/Code";
import Pre from "@components/Markdown/Pre";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  text: string;
}

const PostMarkdownViewer = ({ text }: Props) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className='prose prose-sm prose-slate w-full  max-w-full md:prose-base lg:prose-lg post-markdown code-style'
      components={{
        pre: Pre,
        code: Code,
      }}
    >
      {text}
    </Markdown>
  );
}

export default PostMarkdownViewer;