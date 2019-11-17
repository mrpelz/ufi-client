import { debugSlide } from './slides/debug.js';
import { htmlSlide } from './slides/html.js';
import { imageSlide } from './slides/image.js';
import { moduleSlide } from './slides/module.js';

// DEBUG START
let pause = false;
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
})();
// DEUG END

const head = document.head;
const body = document.body;

const assetRole = 'ufi_asset';

const layerContainer = body.querySelector('ufi-layer-container');
const layerSelector = 'ufi-layer';

const slidePreloadContainer = body.querySelector('ufi-slide-preload-container');
const slideSelector = 'ufi-slide';

const slideTypes = {
  debug: debugSlide,
  html: htmlSlide,
  image: imageSlide,
  module: moduleSlide
};

/**
 * @param {{
 *  create: AssetData[],
 *  delete: AssetData[],
 * }} movement
 */
function handleAssets(movement) {
  movement.delete.forEach(({ id }) => {
    const link = head.querySelector(`#${CSS.escape(id)}`);
    if (link) link.remove();
  });

  const newLinkElements = movement.create.map(({
    id,
    url,
    type,
    hash,
    MIMEType
  }) => {
    const link = document.createElement('link');

    link.dataset.role = assetRole;
    link.rel = type === 'modulepreload' ? 'modulepreload' : 'preload';
    if (hash) link.integrity = hash;
    if (id) link.id = id;
    if (MIMEType) link.type = MIMEType;
    if (type && type !== 'modulepreload') link.as = type;
    if (url) link.href = url;

    return link;
  });

  head.append(...newLinkElements);
}

/**
 * @param {SlideData} data
 * @param {AssetData[]} assets
 */
function handleSlide(data, assets) {
  const {
    assets: assetIds,
    id,
    type
  } = data;

  const element = document.createElement(slideSelector);

  if (id) element.id = id;
  if (type) element.className = type;

  const slideContent = /** @type {import('./slides/debug.js').AnySlide} */ (
    slideTypes[type] || debugSlide
  );

  if (slideContent instanceof Function) {
    const matchingAssets = assets.filter(({ id: assetId }) => assetIds.includes(assetId));
    slideContent(element, data, matchingAssets);
  }

  return element;
}

/**
 * @param {{
 *  createForPreload: SlideData[],
 *  createForLayer: SlideData[],
 *  moveToPreload: SlideData[],
 *  moveToLayer: SlideData[],
 *  delete: SlideData[]
 * }} movement
 * @param {AssetData[]} assets
 */
function handleSlides(movement, assets) {
  const newSlidesForPreload = movement.createForPreload.map((data) => {
    const element = handleSlide(data, assets);
    return element;
  });

  const newSlidesForLayer = movement.createForLayer.map((data) => {
    const element = handleSlide(data, assets);
    return element;
  });

  const oldSlidesMovingToPreload = movement.moveToPreload.map(
    ({ id }) => layerContainer.querySelector(`#${CSS.escape(id)}`)
  ).filter(Boolean);

  const oldSlidesMovingToLayer = movement.moveToLayer.map(
    ({ id }) => slidePreloadContainer.querySelector(`#${CSS.escape(id)}`)
  ).filter(Boolean);

  movement.delete.forEach(({ id }) => {
    const element = slidePreloadContainer.querySelector(`#${CSS.escape(id)}`);
    if (element) element.remove();
  });

  slidePreloadContainer.append(...newSlidesForPreload, ...oldSlidesMovingToPreload);

  return [...newSlidesForLayer, ...oldSlidesMovingToLayer];
}

/**
 * @param {Element} element
 * @param {LayerData} data
 */
function updateLayer(element, data) {
  const {
    classNames,
    state
  } = data;
  if (classNames) element.className = classNames;
  if (state) element.dispatchEvent(new Event('state', {
    'bubbles': false,
    'cancelable': false
  }));
}

/**
 * @param {{
 *  create: LayerData[],
 *  update: LayerData[],
 *  delete: LayerData[],
 *  order: string[]
 * }} movement
 * @param {Element[]} preloadedSlides
 */
function handleLayers(movement, preloadedSlides) {
  const newLayers = movement.create.map((data) => {
    const { id, slide } = data;

    const element = document.createElement(layerSelector);
    element.id = id;

    updateLayer(element, data);

    const matchingSlide = preloadedSlides.find(({ id: slideId }) => slide === slideId);
    if (matchingSlide) element.append(matchingSlide);

    return element;
  });

  movement.delete.forEach(({ id }) => {
    const element = layerContainer.querySelector(`#${CSS.escape(id)}`);
    if (element) element.remove();
  });

  movement.update.forEach((data) => {
    const { id } = data;

    const element = layerContainer.querySelector(`#${CSS.escape(id)}`);
    if (!element) return;

    updateLayer(element, data);
  });

  const orderedLayers = movement.order.map(
    (id) => [
      ...newLayers,
      ...Array.from(layerContainer.querySelectorAll(layerSelector))
    ].find(
      ({ id: layerId }) => id === layerId
    )
  ).filter(Boolean);

  layerContainer.append(...orderedLayers);
}

/**
 * @param {any} input
 */
function isObject(input) {
  return input instanceof Object
    && !(input instanceof Function);
}

/**
 * @param {Object} target
 * @param {Object} source
 * @returns {boolean}
 */
function deepEqual(target, source) {
  if (!isObject(source) || !isObject(target)) {
    return source === target;
  }

  if (Array.isArray(source)) {
    if (!Array.isArray(target)) return false;

    return source.every((sourceValue, index) => {
      const { [index]: targetValue } = target;

      return deepEqual(targetValue, sourceValue);
    });
  }

  return Object.keys(source).every((prop) => {
    const { [prop]: targetValue } = target;
    const { [prop]: sourceValue } = source;

    return deepEqual(targetValue, sourceValue);
  });
}

/**
 * @param {MessageData|null} oldData
 * @param {MessageData} newData
 */
function calculateMovements(oldData, newData) {
  const data = oldData || {
    assets: /** @type {AssetData[]} */ ([]),
    slides: /** @type {SlideData[]} */ ([]),
    layers: /** @type {LayerData[]} */ ([])
  };

  return {
    assets: {
      create: newData.assets.filter(
        ({ id: newAssetId }) => !data.assets.find(
          ({ id: oldAssetId }) => newAssetId === oldAssetId
        )
      ),
      delete: data.assets.filter(
        ({ id: oldAssetId }) => !newData.assets.find(
          ({ id: newAssetId }) => oldAssetId === newAssetId
        )
      )
    },
    slides: {
      createForPreload: newData.slides.filter(
        ({ id: newSlideId }) => (
          !data.slides.find(
            ({ id: oldSlideId }) => newSlideId === oldSlideId
          )
          && !newData.layers.find(
            ({ slide }) => newSlideId === slide
          )
        )
      ),
      createForLayer: newData.slides.filter(
        ({ id: newSlideId }) => (
          !data.slides.find(
            ({ id: oldSlideId }) => newSlideId === oldSlideId
          )
          && newData.layers.find(
            ({ slide }) => newSlideId === slide
          )
        )
      ),
      moveToPreload: newData.slides.filter(
        ({ id: newSlideId }) => (
          data.slides.find(
            ({ id: oldSlideId }) => newSlideId === oldSlideId
          )
          && !newData.layers.find(
            ({ slide }) => newSlideId === slide
          )
          && data.layers.find(
            ({ slide }) => newSlideId === slide
          )
        )
      ),
      moveToLayer: newData.slides.filter(
        ({ id: newSlideId }) => (
          data.slides.find(
            ({ id: oldSlideId }) => newSlideId === oldSlideId
          )
          && newData.layers.find(
            ({ slide }) => newSlideId === slide
          )
          && !data.layers.find(
            ({ slide }) => newSlideId === slide
          )
        )
      ),
      delete: data.slides.filter(
        ({ id: oldSlideId }) => !newData.slides.find(
          ({ id: newSlideId }) => newSlideId === oldSlideId
        )
      )
    },
    layers: {
      create: newData.layers.filter(
        ({ id: newLayerId }) => !data.layers.find(
          ({ id: oldLayerId }) => newLayerId === oldLayerId
        )
      ),
      update: newData.layers.filter(
        (newLayer) => {
          const oldLayer = data.layers.find(
            ({ id: oldLayerId }) => newLayer.id === oldLayerId
          );

          if (!oldLayer) return false;
          if (
            (oldLayer.classNames === newLayer.classNames)
            && deepEqual(oldLayer.state, newLayer.state)
          ) return false;

          return true;
        }
      ),
      delete: data.layers.filter(
        ({ id: oldLayerId }) => !newData.layers.find(
          ({ id: newLayerId }) => oldLayerId === newLayerId
        )
      ),
      order: newData.layers.map(({ id }) => id)
    }
  };
}


/**
 * @type {MessageData|null}
 */
let data = null;

function handleMessage({ data: payload }) {
  if (pause) return;

  /**
   * @type {MessageData}
   */
  let newData;

  try {
    newData = JSON.parse(payload);
  } catch (_) {
    return;
  }

  const movements = calculateMovements(data, newData);
  data = newData;

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(movements, null, 2));

  handleAssets(movements.assets);
  const preloadedSlides = handleSlides(movements.slides, data.assets);
  handleLayers(movements.layers, preloadedSlides);
}

export function app() {
  const streamUrl = new URL(window.location.href);
  streamUrl.pathname = '/stream';

  const stream = new EventSource(streamUrl.toString());
  stream.onmessage = handleMessage;
}
