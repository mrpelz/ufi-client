import { h, render } from './external/preact.js';
import { Debug } from './slides/debug.js';
import { HTML } from './slides/html.js';
import { Image } from './slides/image.js';
import { Layer } from './layer.js';
import htm from './external/htm.js';

// DEBUG START
let pause = false;
let debug = false;
let debugCallback = null;
(() => {

  /**
   * @param {boolean} doPause
   */
  const ufiPause = (doPause) => {
    pause = doPause;
  };

  Object.defineProperty(window, 'ufiPause', {
    value: ufiPause
  });

  /**
   * @param {boolean} doDebug
   */
  const ufiDebug = (doDebug) => {
    debug = doDebug;

    if (debugCallback instanceof Function) {
      debugCallback();
    }
  };

  Object.defineProperty(window, 'ufiDebug', {
    value: ufiDebug
  });
})();
// DEUG END

export const html = htm.bind(h);

const head = document.head;
const body = document.body;
const assetRole = 'ufi_asset';
const assetSelector = `link[data-role="${assetRole}"]`;

const slideTypes = {
  debug: Debug,
  html: HTML,
  image: Image
};

/**
 * @param {AssetData[]} assets
 */
function handleAssets(assets) {
  const linkElements = assets.reduce((fragment, {
    hash,
    MIMEType,
    type,
    url
  }) => {
    const link = document.createElement('link');

    if (url) link.href = url;

    if (type === 'modulepreload') {
      link.rel = 'modulepreload';
    } else {
      link.rel = 'preload';
      if (type) link.as = type;
      if (assetRole) link.dataset.role = assetRole;
      if (hash) link.integrity = hash;
      if (MIMEType) link.type = MIMEType;
    }

    fragment.append(link);

    return fragment;
  }, document.createDocumentFragment());

  Array.from(head.querySelectorAll(assetSelector)).forEach((linkItem) => linkItem.remove());

  head.append(linkElements);
}

/**
 * @param {AssetData[]} assetsData
 * @param {SlideData[]} slidesData
 * @param {LayerData} layer
 */
function handleLayer(assetsData, slidesData, layer) {
  const { slide: slideId, state } = layer;

  const slide = slidesData.find((s) => s.id === slideId);
  if (!slide) return null;

  const { type: slideType, assets: slideAssetIds } = slide;
  if (!slideType) return null;

  const assets = slideAssetIds.map(
    (assetId) => assetsData.find(
      (assetData) => assetData.id === assetId
    )
  ).filter(Boolean);

  const Slide = /** @type {import('./slides/debug.js').AnySlide} */ (
    debug
    ? Debug
    : slideTypes[slideType] || Debug
  );

  return Layer({
    layer,
    children: [
      Slide({
        slide: {
          ...slide,
          assets,
          state
        }
      })
    ]
  });
}

/**
 * @param {AssetData[]} assets
 * @param {SlideData[]} slides
 * @param {LayerData[]} layers
 */
function handleLayers(assets, slides, layers) {
  const Root = layers.reverse().map((layer) => handleLayer(assets, slides, layer));

  render(Root, body);
}

function handleMessage({ data: payload }) {
  if (pause) return;

  /**
   * @type {MessageData}
   */
  let data;

  try {
    data = JSON.parse(payload);
  } catch (_) {
    return;
  }

  if (debug) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data, null, 2));
  }

  const {
    assets = /** @type {AssetData[]} */ ([]),
    slides = /** @type {SlideData[]} */ ([]),
    layers = /** @type {LayerData[]} */ ([])
  } = data;

  const run = () => {
    handleAssets(assets);
    handleLayers(assets, slides, layers);
  };

  run();

  debugCallback = run;
}

export function app() {
  const streamUrl = new URL(window.location.href);
  streamUrl.pathname = '/stream';

  const stream = new EventSource(streamUrl.toString());
  stream.onmessage = handleMessage;
}
