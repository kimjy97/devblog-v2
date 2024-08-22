import { useEffect, useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Code = (
  props: any,
) => {

  const match = /language-(\w+)/.exec(props.className || '');

  useEffect(() => {
    const handleClick = (event: any) => {
      const clickedSpanContent = event.target.textContent;
      const spans = document.querySelectorAll('code span .token');
      spans.forEach((span) => {
        const htmlSpan = span as HTMLElement;
        if (htmlSpan.textContent === clickedSpanContent) {
          htmlSpan.style.backgroundColor = '#ff000060';
        } else {
          htmlSpan.style.backgroundColor = 'initial';
        }
      });
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const selectedText = selection.toString();
      const spans = document.querySelectorAll('code span .token');
      spans.forEach((span) => {
        const htmlSpan = span as HTMLElement;
        if (htmlSpan.textContent && htmlSpan.textContent.includes(selectedText) && selectedText !== '') {
          htmlSpan.style.backgroundColor = '#ff000060';
        } else {
          htmlSpan.style.backgroundColor = 'initial';
        }
      });
    };

    const spans = document.querySelectorAll('code span .token');
    spans.forEach((span) => {
      span.addEventListener('click', handleClick);
    });

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      spans.forEach((span) => {
        span.removeEventListener('click', handleClick);
      });
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const memoizedCode = useMemo(() => {
    if (!match) {
      return <code className="singlePre" {...props} />;
    }

    return (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        wrapLines
      >
        {String(props.children)}
      </SyntaxHighlighter>
    );
  }, [match, props.children]);

  return memoizedCode;
}

export default Code;
