import Clipboard from "@/components/Clipboard";
import LanguageIcon from "@components/Markdown/LanguageIcon";
import { ClassAttributes, HTMLAttributes, ReactElement } from "react";
import { ExtraProps } from "react-markdown";
import styled from "styled-components";

const Pre = (
  { children, ...rest }: ClassAttributes<HTMLPreElement> &
    HTMLAttributes<HTMLPreElement> &
    ExtraProps,
) => {

  const language = (children as ReactElement)?.props?.className?.replace(
    "language-",
    "",
  );

  if (!language) return <pre {...rest}>{children}</pre>;
  return (
    <Container>
      <LanguageWrapper>
        <div>
          <LanguageIcon language={language} size={15} />
          <p>{language.toUpperCase()}</p>
        </div>
        <Clipboard text={String((children as ReactElement)?.props?.children)} />
      </LanguageWrapper>
      {children}
    </Container>
  );
}

export default Pre;

const Container = styled.div`
    margin: 2em 0 !important;
    background-color: rgb(8, 8, 12) !important;
    border-radius: 18px;
`;

const LanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem;
  user-select: none;

  & p {
    padding-top: 0.1875em;
    color: #88889a;
    font-size: 0.75em;
    line-height: 1.25em;
    font-weight: 500;
  }

  &>div {
    display: flex;
    align-items: center;
    gap: 0.75em;
    & svg {
      color: #fff;
    }
  }
`;
