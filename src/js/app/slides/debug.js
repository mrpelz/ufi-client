/**
 * @typedef I_HTML
 * @type {import('./html.js')['htmlSlide']}
 */

 /**
 * @typedef I_Image
 * @type {import('./image.js')['imageSlide']}
 */

 /**
 * @typedef I_React
 * @type {import('./module.js')['reactSlide']}
 */

/**
 * @typedef AnySlide
 * @type {typeof debugSlide}
 */

/**
 * @param {Element} root
 * @param {SlideData} data
 * @param {AssetData[]} assets
 */
export const debugSlide = (root, { id, type }, assets) => {
  root.innerHTML = `
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
