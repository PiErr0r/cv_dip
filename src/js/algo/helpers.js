const _fillImage = (m, normalize = false) => {
  let tmp = new ImageData(m[0].length, m.length);
  const nImg = new ImgData(tmp);
  nImg.setGrayscale(true);
  
  if (normalize) {
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < m.length; ++i) {
      for (let j = 0; j < m[0].length; ++j) {
        min = Math.min(min, m[i][j]);
        max = Math.max(max, m[i][j]);
      }
    }
    const diff = max - min;
    for (let i = 0; i < m.length; ++i) {
      for (let j = 0; j < m[0].length; ++j) {
        m[i][j] = (m[i][j] - min) * 255 / diff;
      }
    }
  }

  for (let i = 0; i < m.length; ++i) {
    for (let j = 0; j < m[0].length; ++j) {
      nImg._s(i, j, 0, m[i][j]);
      nImg._sa(i, j, 255);
    }
  }

  return nImg;
}