import { html } from '../index.js';
import { useState } from '../../lib/preact/hooks/src/index.js';

/**
 * @param {{
 *  slide: SlideDataResolved
 * }} props
 */
export const React = ({ slide, slide: { assets: [moduleAsset] } }) => {
  const [moduleObject, setModule] = useState(null);
  const { url } = moduleAsset;

  import(url).then((moduleDownload) => {
    setModule(moduleDownload);
  });

  return html`
    <section
      data-role="ufi_slide"
      class="react"
    >
      ${moduleObject && moduleObject.default ? moduleObject.default(html, slide) : null}
    </section>
  `;
};
