import { dynamicImport } from '../dynamicImport.js';

/**
 * @param {Element} root
 * @param {LayerData} data
 * @param {AssetData[]} assets
 */
export const moduleLayer = (root, data, assets) => {
  const esModulesLoading = Promise.all(assets.filter(
    ({ type, url }) => type === 'modulepreload' && url
  ).map(
    ({ url }) => dynamicImport(url)
  ).filter(Boolean)).then((esModules) => esModules.filter(
    (esModule) => (
      esModules
      && esModule.default
      && esModule.default instanceof Function
    )
  ));

  const stylesheets = assets.filter(
    ({ type, url }) => type === 'style' && url
  );

  const stylesheetElement = stylesheets.length
    ? stylesheets.reduce(
      (stylesheet, { url }) => {
        stylesheet.append(
          `@import url('${url}');`
        );

        return stylesheet;
      },
      document.createElement('style')
    )
    : null;

  root.attachShadow({ mode: 'open' });
  if (stylesheetElement) root.shadowRoot.append(stylesheetElement);

  esModulesLoading.then((esModules) => {
    if (!esModules.length) return;

    const [{ default: render }] = esModules;

    render(root.shadowRoot, data, esModules);
  });
};
