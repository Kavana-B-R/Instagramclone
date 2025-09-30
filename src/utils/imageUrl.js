export const getImageUrl = (imgUrl) => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http')) return imgUrl;
  return `/uploads${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
};
