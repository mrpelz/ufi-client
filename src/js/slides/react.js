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
export const React = ({ slide: { assets: [reactModule] } }) => {
  const { url } = reactModule;

  return html`
    <section
      data-role="ufi_slide"
      class="html"
    >
      <iframe src="${module.url}"></iframe>
    </section>
  `;
};
