'use client'

import PageContainer from "@/components/PageContainer";
import GuestBookComment from "@/containers/GuestBook/GuestBookComment";
import GuestBookForm from "@/containers/GuestBook/GuestBookForm";
import GuestBookInfo from "@/containers/GuestBook/GuestBookInfo";
import GuestBookTitle from "@/containers/GuestBook/GuestBookTitle";

const GuestBook = () => {
  return (
    <PageContainer>
      <GuestBookTitle />
      <GuestBookInfo />
      <GuestBookComment />
      <GuestBookForm />
    </PageContainer>
  );
}

export default GuestBook;