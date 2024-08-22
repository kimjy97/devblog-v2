'use client'

import { postInfoState } from "@/atoms/post";
import { apiGet } from "@/services/api";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

interface IProps {
  params: any;
};

const FetchPostInfo = ({ params }: IProps): null => {
  const [, setPostInfo] = useRecoilState(postInfoState);

  const getPostInfo = async () => {
    const result = await apiGet('/api/blog/post', {
      params: { id: params.id }
    }).then(res => res.post)

    setPostInfo(result);
  }

  useEffect(() => {
    setPostInfo(undefined);
    setTimeout(() => getPostInfo(), 0);
  }, [params])

  return null;
};

export default FetchPostInfo;