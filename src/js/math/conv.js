const _conv = (image, kernel) => {
  const nImg = new Matrix(image.height, image.width);
  const [h, w] = kernel.dim();
  const midH = h >> 1;
  const midW = w >> 1;

  for (let i = 0; i < nImg.length; ++i) {
    for (let j = 0; j < nImg[0].length; ++j) {
      let res = 0;
      for (let m = -midH; m <= midH; ++m) {
        for (let n = -midW; n <= midW; ++n) {
          const a = kernel[m + midH][n + midW];
          const b = image.g(i - m, j - n, 0, 0);
          res += a * b;
        }
      }
      nImg[i][j] = Math.abs(res);
    }
  }
  return nImg;
}