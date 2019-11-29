/**
 * @param {string} url
 * @returns {Promise<Object>}
 */
export const dynamicImport = (url) => import(url);
