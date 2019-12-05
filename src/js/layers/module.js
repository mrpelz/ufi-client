import { dynamicImport } from '../dynamicImport.js';

/**
 * @param {HTMLElement} element
 * @param {LayerData} _
 * @param {AssetData[]} assets
 */
export const moduleLayer = (element, _, assets) => {
  const ready = () => {
    window.requestAnimationFrame(() => {
      element.setAttribute('ready', '');
    });
  };

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

  element.attachShadow({ mode: 'open' });
  if (stylesheetElement) element.shadowRoot.append(stylesheetElement);

  esModulesLoading.then((esModules) => {
    if (!esModules.length) return;

    const [{ default: render }] = esModules;

    render(element, esModules).then(ready);
  });
};
