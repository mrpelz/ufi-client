import { html } from '../index.js';

/**
 * @typedef AnySlide
 * @type {typeof Debug | typeof import('./image.js')['Image']}
 */

/**
 * @param {{
 *  slide: SlideDataResolved
 * }} props
 */
export const Debug = ({ slide: { assets, id, state, type } }) => {
  return html`
    <section
      data-role="ufi_slide"
      class="debug"
    >
    <h2>id: ${id}</h2>
    <h3>type: ${type}</h3>

      <p>Assets:</p>
      <ul>
        ${assets.map(
          (asset) => html`
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
      <p>State:</p>
      <p>${JSON.stringify(state, null, null)}</p>
    </section>
  `;
};
