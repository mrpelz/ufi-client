/**
 * @param {Element} root
 * @param {SlideData} _
 * @param {AssetData[]} assets
 */
export const imageSlide = (root, _, assets) => {
  const [image] = assets;

  root.innerHTML = `
    <img src="${image.url}" />
  `;
};
