import { html } from '../index.js';

/**
 * @param {{
  *  slide: SlideDataResolved
  * }} props
  */
 export const HTML = ({ slide: { assets: [document] } }) => {
   return html`
     <section
       data-role="ufi_slide"
       class="html"
     >
       <iframe src="${document.url}"></iframe>
     </section>
   `;
 };
