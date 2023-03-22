export function changeColor(color: Record<string, number>): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const img = new Image(100, 100);
  img.crossOrigin = "Anonymous"; 
  img.src = 'https://mdn.alipayobjects.com/huamei_nsuaz4/afts/img/A*770bQLV21hsAAAAAAAAAAAAADimPAQ/original';

  return new Promise((resolve) => {
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 修改颜色值
      for (let i = 0; i < data.length; i += 4) {
        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
      }

      ctx.putImageData(imageData, 0, 0);

      const base64 = canvas.toDataURL('image/png');

      const imgElement = document.createElement('img');
      imgElement.src = base64;
      document.body.appendChild(imgElement)
      resolve(imgElement)
    }
  })

}
