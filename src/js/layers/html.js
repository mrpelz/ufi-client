/**
 * @param {HTMLElement} element
 * @param {LayerData} _
 * @param {AssetData[]} assets
 */
export const htmlLayer = (element, _, assets) => {
  const [document] = assets;

  element.innerHTML = `
    <iframe src="${document.url}"></iframe>
  `;
};
