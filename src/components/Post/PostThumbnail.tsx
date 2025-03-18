import styled from "styled-components"
import Image from "next/image"
import ReactjsImg from '@public/images/categorys/Reactjs_category.png';
import ReactNativeImg from '@public/images/categorys/ReactNative_category.png';
import NextjsImg from '@public/images/categorys/Nextjs_category.png';
import HtmlImg from '@public/images/categorys/html_category.png';
import TipImg from '@public/images/categorys/tip_category.png';

interface IProps {
  category: string,
}

const TumbnailDefault = ({ category }: IProps) => {
  const thumbStyleArr = [
    {
      category: 'defalut',
      imageSrc: ReactjsImg,
      filter: 'drop-shadow(0 -6px 36px #cceb)',
      style: {
        background: '#161615',
      },
      imageStyle: {
        height: '68%',
      }
    },
    {
      category: 'React.js',
      imageSrc: ReactjsImg,
      filter: 'drop-shadow(0 -6px 36px #cceb)',
      style: {
        background: '#161615',
      },
      imageStyle: {
        height: '68%',
      }
    },
    {
      category: 'ReactNative',
      imageSrc: ReactNativeImg,
      filter: 'drop-shadow(0 -6px 36px #cceb)',
      style: {
        background: '#1d0a1e',
      },
      imageStyle: {
        height: '68%',
      }
    },
    {
      category: 'Next.js',
      imageSrc: NextjsImg,
      filter: 'drop-shadow(0 -6px 36px #cce9)',
      style: {
        background: 'radial-gradient(#fff 24%, #dbdbe7 48%, #9f9fc4 96%)',
      },
      imageStyle: {
        height: '52%',
      }
    },
    {
      category: 'HTML-CSS',
      imageSrc: HtmlImg,
      filter: 'drop-shadow(0 -6px 36px #cce9)',
      style: {
        background: 'radial-gradient(#261c19 24%, #302623 48%, #473d36 96%)',
      },
      imageStyle: {
        height: '52%',
      }
    },
    {
      category: 'TIP',
      imageSrc: TipImg,
      filter: 'drop-shadow(0 -6px 36px #00000000)',
      style: {
        background: 'radial-gradient(#99991c 24%, #787823 48%, #3f4119 96%)',
      },
      imageStyle: {
        height: '40%',
      }
    }
  ]
  const thumbStyle = thumbStyleArr.find(i => i.category === category) ?? thumbStyleArr[0]
  const filter = { filter: thumbStyle.filter };


  return (
    <Container>
      <Background style={thumbStyle.style} />
      <LightFilter />
      <Image
        id='thumb'
        src={thumbStyle.imageSrc}
        style={{ ...thumbStyle.imageStyle, ...filter }}
        alt='defaultImage'
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  img {
    width: auto;
    transition: filter 150ms ease-out, transform 900ms ease-out;
  }
`
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 0;
`
const LightFilter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  
  background-color: var(--bg-pitem-thumbnail-filter);
  
  transition: 150ms;
  z-index: 0;
`

export default TumbnailDefault;