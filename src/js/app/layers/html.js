/**
 * @param {Element} root
 * @param {LayerData} _
 * @param {AssetData[]} assets
 */
export const htmlLayer = (root, _, assets) => {
  const [document] = assets;

  root.innerHTML = `
    <iframe src="${document.url}"></iframe>
  `;
};
