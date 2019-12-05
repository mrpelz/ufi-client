/**
 * @typedef I_HTML
 * @type {import('./html.js')['htmlLayer']}
 */

 /**
 * @typedef I_Image
 * @type {import('./image.js')['imageLayer']}
 */

 /**
 * @typedef I_React
 * @type {import('./module.js')['moduleLayer']}
 */

/**
 * @typedef AnyLayer
 * @type {typeof debugLayer|I_HTML|I_Image|I_React}
 */

/**
 * @param {HTMLElement} element
 * @param {LayerData} data
 * @param {AssetData[]} assets
 */
export const debugLayer = (element, { id, type }, assets) => {
  element.innerHTML = `
    <h2>id: ${id}</h2>
    <h3>type: ${type}</h3>

    <p>Assets:</p>
    <ul>
      ${assets.map(
        (asset) => `
          <li>
            <b>ID: </b>${asset.id}
            <ul>
              <li>
                <b>URL: </b>${asset.url}
              </li>
              <li>
                <b>(preload) type: </b>${asset.type}
              </li>
              <li>
                <b>MIMEType: </b>${asset.MIMEType}
              </li>
              <li>
                <b>hash: </b>${asset.hash}
              </li>
            </ul>
          </li>
        `
      )}
    </ul>
  `;
};
