/**
 * @param {Element} root
 * @param {SlideData} _
 * @param {AssetData[]} assets
 */
export const htmlSlide = (root, _, assets) => {
  const [document] = assets;

  root.innerHTML = `
    <iframe src="${document.url}"></iframe>
  `;
};
