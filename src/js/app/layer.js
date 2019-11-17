import { html } from './index.js';

/**
 * @param {{
 *  layer: LayerData,
 *  children: any
 * }} props
 */
export const Layer = ({ layer: { classNames }, children }) => (
  html`
    <section
      data-role="ufi_layer"
      class="${classNames}"
    >
      ${children}
    </section>
  `
);
