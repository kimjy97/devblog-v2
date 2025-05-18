import TumbnailDefault from '@components/Post/PostThumbnail';
import styled from 'styled-components';
import IconHeart from '@public/svgs/heart.svg';
import IconComment from '@public/svgs/chat3.svg';
import IconView from '@public/svgs/view.svg';
import { useRouter } from 'next/navigation';
import { routeLoadingState } from '@/atoms/pageLoading';
import { useSetRecoilState } from 'recoil';
import moment from 'moment-timezone';

interface IProps {
  data: any,
};

const Post = ({ data }: IProps): JSX.Element => {
  const setIsRouteLoading = useSetRecoilState(routeLoadingState);
  const router = useRouter();

  const handleClickPost = () => {
    router.push(`/post/${data.postId}`)
    setIsRouteLoading(true);
  }

  return (
    <Container onClick={handleClickPost}>
      <ThumbnailWrapper>
        <TumbnailDefault category={data.tags[0]} />
        <PostInfoList id='postInfo'>
          <PostInfoWrapper>
            <ViewIcon />
            <InfoNum>{data.view}</InfoNum>
          </PostInfoWrapper>
          <PostInfoWrapper>
            <HeartIcon />
            <InfoNum>{data.like}</InfoNum>
          </PostInfoWrapper>
          <PostInfoWrapper>
            <ChatIcon />
            <InfoNum>{data.cmtnum}</InfoNum>
          </PostInfoWrapper>
        </PostInfoList>
      </ThumbnailWrapper>
      <BoardName>{data.tags[0]}</BoardName>
      <Title>{data.title}</Title>
      <TagListWrapper id='tag'>
        {/*
          <TagList>
          {data.tags.map((t: any, idx2: number) =>
            idx2 !== 0 &&
            <Tag href={{ query: { board: 'all', tag: t } }} key={idx2}>
              {t}
            </Tag>
          )}
        </TagList>
          */}
      </TagListWrapper>
      <UploadInfoWrapper>
        <UploadInfo>{data.name}</UploadInfo>
        <UploadInfo>{moment(data.createdAt).format('YYYY. MM. DD')}</UploadInfo>
      </UploadInfoWrapper>
    </Container>
  )
};

export default Post;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 280px;
  max-height: 340px;
  width: 100%;
  aspect-ratio: 100/100;
  
  background-color: var(--bg-pitem);
  border: var(--bg-pitem-border);
  border-radius: 12px;
  //box-shadow: var(--bg-pitem-boxshadow);
  box-sizing: border-box;
  overflow: hidden;

  transition: box-shadow 150ms ease-out, background-color 150ms ease-out, border 150ms;
  cursor: default;

  &>a {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;

    cursor: initial;
  }

  &:hover {
    background-color: var(--bg-pitem-hover);
    //box-shadow: var(--bg-pitem-boxshadow);

    #thumb {
      transform: scale(1.08);
    }
    #postInfo {
      li {
        opacity: 1;
      }
    }
    #tag li {
      background-color: var(--bg-pitem-hover-tag);
      opacity: 0.8;
    }
  }
`
const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  max-height: 210px;
  aspect-ratio: 8/5;

  overflow: hidden;

  cursor: pointer;
`
const PostInfoList = styled.ul`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  top: 5px;
  left: 4px;
`
const PostInfoWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 38px;
  padding: 0.25rem 0.5rem;

  background-color: var(--bg-pitem-postinfo);
  border-radius: 8px;
  opacity: 0.65;

  transition: 150ms;
`
const InfoNum = styled.p`
  color: var(--text-normal);
  font-size: 0.65rem;

  transition: color 150ms;
`
const BoardName = styled.span`
  position: relative;
  padding: 0 12px;
  margin-top: 12px;

  font-size: 0.75rem;
  color: var(--bg-pitem-boardname);

  cursor: pointer;
  transition: 150ms;
  
  &:hover {
    color: var(--bg-pitem-boardname-hover);
  }
`
const Title = styled.p`
  position: relative;
  padding: 0px 12px;
  margin-top: 6px;
  
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  word-break: break-all;
    
  color: var(--text-normal);
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.16rem;

  transition: 150ms;
  cursor: pointer;
`
const UploadInfoWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  justify-self: flex-end;
  width: 100%;
  padding: 0px 14px;
  padding-bottom: 12px;
  
  font-size: 0.75rem;
  color: var(--text-sub);
  white-space: nowrap;
`
const UploadInfo = styled.p`
`
const TagListWrapper = styled.div`
  position: relative;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const ViewIcon = styled(IconView)`
  width: 12px;
  height: 12px;

  fill: var(--text-normal-reverse);
  filter: var(--img-pitem-icon);

  transition: filter 150ms, opacity 150ms;
`
const HeartIcon = styled(IconHeart)`
  width: 12px;
  height: 10px;

  fill: var(--text-normal-reverse);
  filter: var(--img-pitem-icon);

  transition: filter 150ms, opacity 150ms;
`
const ChatIcon = styled(IconComment)`
  width: 12px;
  height: 10px;

  fill: var(--text-normal-reverse);
  filter: var(--img-pitem-icon);

  transition: filter 150ms, opacity 150ms;
`
