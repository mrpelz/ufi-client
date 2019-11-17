import { dynamicImport } from '../dynamicImport.js';

/**
 * @param {Element} root
 * @param {SlideData} data
 * @param {AssetData[]} assets
 */
export const moduleSlide = (root, data, assets) => {
  const [moduleAsset] = assets;
  if (moduleAsset.type !== 'modulepreload') return;

  dynamicImport(moduleAsset.url).then((esModule) => {
    if (
      !esModule
      || !esModule.default
      || !(esModule.default instanceof Function)
    ) return;

    esModule.default(root, data);
  });
};
