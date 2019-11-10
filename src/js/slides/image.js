import { html } from '../index.js';

/**
 * @param {{
  *  slide: SlideDataResolved
  * }} props
  */
 export const Image = ({ slide: { assets: [image] } }) => {
   return html`
     <section
       data-role="ufi_slide"
       class="image"
     >
       <img src="${image.url}" />
     </section>
   `;
 };
