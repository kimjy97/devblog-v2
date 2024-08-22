export const imageToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const resizeImage = (base64: any, w: number = 400, h: number = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      // 원본 이미지의 너비와 높이
      const originalWidth = img.width;
      const originalHeight = img.height;

      // 비율 계산
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = w;
      let newHeight = h;

      // 새로운 크기 계산
      if (originalWidth > originalHeight) {
        newHeight = newWidth / aspectRatio;
        if (newHeight > h) {
          newHeight = h;
          newWidth = newHeight * aspectRatio;
        }
      } else {
        newWidth = newHeight * aspectRatio;
        if (newWidth > w) {
          newWidth = w;
          newHeight = newWidth / aspectRatio;
        }
      }

      // Canvas 생성
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx: any = canvas.getContext('2d');

      // 이미지를 Canvas에 그리기
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Canvas의 내용을 Base64 문자열로 변환
      const resizedBase64 = canvas.toDataURL();
      resolve(resizedBase64);
    };


    img.onerror = (error: any) => {
      reject(error);
    };
  });
}

export const base64ToFile = (str: string) => {
  const blob = new Blob([str.split(',')[1]], { type: str.split(',')[0].split(':')[1] });
  const fileUrl = URL.createObjectURL(blob);

  return fileUrl;
}

export const getFileTypeFromBase64 = (base64Uri: string) => {
  // base64 URI에서 파일 타입만 추출하는 정규 표현식
  const regex = /^data:(.*);base64,/;
  const match = base64Uri.match(regex);

  if (match && match.length > 1) {
    return match[1];
  }

  throw new Error("Invalid base64 URI");
}