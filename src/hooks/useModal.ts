import { overlayState } from "@/atoms/layout";
import { useRecoilState } from "recoil";

export const useModal = () => {
  const [overlay, setOverlay] = useRecoilState(overlayState);

  const handleModalClose = (setVisibleModal: any) => {
    if (overlay) {
      setVisibleModal(undefined);
      setOverlay(false);
    }
  }

  return { handleModalClose }
}
