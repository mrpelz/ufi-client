/**
 * @param {Element} root
 * @param {LayerData} _
 * @param {AssetData[]} assets
 */
export const imageLayer = (root, _, assets) => {
  const [image] = assets;

  root.innerHTML = `
    <img src="${image.url}" />
  `;
};
