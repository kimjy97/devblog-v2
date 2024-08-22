import { isStaticHeaderState } from "@/atoms/haeder";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export const useHeader = () => {
  const [position, setPosition] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.scrollY;

      setPosition(moving);

      if (moving <= 30) {
        setVisible(false);
      } else if ((position - moving) > 30) {
        setVisible(true);
      } else if ((moving - position) > 30) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clear the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [position]);

  return visible;
}

export const useStaticHeader = (bool: boolean) => {
  const [, setIsStaticHeader] = useRecoilState(isStaticHeaderState);

  useEffect(() => {
    setIsStaticHeader(bool);
    return (() => {
      setIsStaticHeader(false);
    })
  }, [])
}