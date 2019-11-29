import { debugLayer } from './layers/debug.js';
import { htmlLayer } from './layers/html.js';
import { imageLayer } from './layers/image.js';
import { moduleLayer } from './layers/module.js';

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
const layerSelector = 'ufi-layer';

const layerTypes = {
  debug: debugLayer,
  html: htmlLayer,
  image: imageLayer,
  module: moduleLayer
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
 * @param {LayerData} data
 * @param {AssetData[]} assets
 */
function createLayer(data, assets) {
  const {
    assets: assetIds,
    id,
    type
  } = data;

  const element = document.createElement(layerSelector);

  if (id) element.id = id;
  if (type) element.setAttribute('ufi-type', type);

  const layerContent = /** @type {import('./layers/debug.js').AnyLayer} */ (
    layerTypes[type] || debugLayer
  );

  if (layerContent instanceof Function) {
    const matchingAssets = assets.filter(({ id: assetId }) => assetIds.includes(assetId));
    layerContent(element, data, matchingAssets);
  }

  return element;
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
 * @param {AssetData[]} assets
 */
function handleLayers(movement, assets) {
  const newLayers = movement.create.map((data) => {
    const element = createLayer(data, assets);
    updateLayer(element, data);

    return element;
  });

  movement.delete.forEach(({ id }) => {
    const element = body.querySelector(`#${CSS.escape(id)}`);
    if (element) element.remove();
  });

  movement.update.forEach((data) => {
    const { id } = data;

    const element = body.querySelector(`#${CSS.escape(id)}`);
    if (!element) return;

    updateLayer(element, data);
  });

  const orderedLayers = movement.order.map(
    (id) => [
      ...newLayers,
      ...Array.from(body.querySelectorAll(layerSelector))
    ].find(
      ({ id: layerId }) => id === layerId
    )
  ).filter(Boolean);

  body.append(...orderedLayers);
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

  handleAssets(movements.assets);
  handleLayers(movements.layers, data.assets);
}

export function app() {
  const streamUrl = new URL(window.location.href);
  streamUrl.pathname = '/stream';

  const stream = new EventSource(streamUrl.toString());
  stream.onmessage = handleMessage;
}
