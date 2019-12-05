/**
 * @param {HTMLElement} element
 * @param {LayerData} _
 * @param {AssetData[]} assets
 */
export const imageLayer = (element, _, assets) => {
  const [image] = assets;

  element.innerHTML = `
    <img src="${image.url}" />
  `;
};
