import { debugLayer } from './layers/debug.js';
import { htmlLayer } from './layers/html.js';
import { imageLayer } from './layers/image.js';
import { moduleLayer } from './layers/module.js';
import { videoLayer } from './layers/video.js';

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

const assetAttribute = 'ufi-asset';
const layerSelector = 'ufi-layer';

const layerTypes = {
  debug: debugLayer,
  html: htmlLayer,
  image: imageLayer,
  module: moduleLayer,
  video: videoLayer
};

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

    link.setAttribute(assetAttribute, '');
    link.rel = type === 'modulepreload' ? 'modulepreload' : 'preload';
    if (hash) link.integrity = hash;
    if (id) link.id = id;
    if (MIMEType) link.type = MIMEType;
    if (type && type !== 'modulepreload') link.as = type;
    if (url) link.href = url;

    return link;
  });

  window.requestAnimationFrame(() => {
    head.append(...newLinkElements);
    head.normalize();
  });
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

  const element = /** @type {UfiLayerElement} */ (document.createElement(layerSelector));
  Object.defineProperty(element, 'ufiState', {
    value: null,
    writable: true
  });
  Object.defineProperty(element, 'ufiStateCallback', {
    value: null,
    writable: true
  });

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
 * @param {UfiLayerElement} element
 * @param {LayerData} data
 */
function updateLayer(element, data) {
  const columns = 12;
  const rows = 12;

  const {
    state,
    state: {
      layout: {
        backgroundColor = 'none',
        spanColumns = null,
        spanRows = null,
        alignX = null,
        alignY = null,
        fromColumn = null,
        fromRow = null,
        toColumn = null,
        toRow = null
      } = {}
    } = {}
  } = data;

  element.style.setProperty('--column-count', columns.toString(10));
  element.style.setProperty('--row-count', rows.toString(10));

  element.style.setProperty('--background-color', backgroundColor);

  if (fromColumn && toColumn) {
    element.style.setProperty('--column-from', fromColumn.toString(10));
    element.style.setProperty('--column-to', toColumn.toString(10));
  } else {
    const margin = columns - spanColumns;

    if (alignX === 'left') {
      const marginRight = columns - margin;

      element.style.setProperty('--column-from', '1');
      element.style.setProperty('--column-to', marginRight.toString(10));
    } else if (alignX === 'right') {
      const marginLeft = margin + 1;

      element.style.setProperty('--column-from', marginLeft.toString(10));
      element.style.setProperty('--column-to', columns.toString(10));
    } else {
      const marginLeft = Math.floor(margin / 2) + 1;
      const marginRight = columns - Math.ceil(margin / 2);

      element.style.setProperty('--column-from', marginLeft.toString(10));
      element.style.setProperty('--column-to', marginRight.toString(10));
    }
  }

  if (fromRow && toRow) {
    element.style.setProperty('--row-from', fromRow.toString(10));
    element.style.setProperty('--row-to', toRow.toString(10));
  } else {
    const margin = rows - spanRows;

    if (alignY === 'top') {
      const marginBottom = columns - margin;

      element.style.setProperty('--row-from', '1');
      element.style.setProperty('--row-to', marginBottom.toString(10));
    } else if (alignY === 'bottom') {
      const marginTop = margin + 1;

      element.style.setProperty('--row-from', marginTop.toString(10));
      element.style.setProperty('--row-to', rows.toString(10));
    } else {
      const marginTop = Math.floor(margin / 2) + 1;
      const marginBottom = rows - Math.ceil(margin / 2);

      element.style.setProperty('--row-from', marginTop.toString(10));
      element.style.setProperty('--row-to', marginBottom.toString(10));
    }
  }

  element.ufiState = state;

  // @ts-ignore
  const { ufiStateCallback } = element;
  if (ufiStateCallback && ufiStateCallback instanceof Function) {
    return ufiStateCallback(state);
  }

  return null;
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
function handleLayers({ create, update, delete: del, order }, assets) {
  const newLayers = create.map((data) => {
    const element = createLayer(data, assets);
    updateLayer(element, data);

    return element;
  });

  update.forEach((data) => {
    const { id } = data;

    const element = /** @type {UfiLayerElement} */ (body.querySelector(`#${CSS.escape(id)}`));
    if (!element || !(element instanceof HTMLElement)) return;

    updateLayer(element, data);
  });

  del.forEach(({ id }) => {
    const element = body.querySelector(`#${CSS.escape(id)}`);
    if (element) element.remove();
  });

  const orderedLayers = order.map(
    (id) => [
      ...newLayers,
      ...Array.from(body.querySelectorAll(layerSelector))
    ].find(
      ({ id: layerId }) => id === layerId
    )
  ).filter(Boolean);

  window.requestAnimationFrame(() => {
    body.append(...orderedLayers);
    body.normalize();
  });
}

/**
 * @param {UpdateData|null} oldData
 * @param {UpdateData} newData
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
          if (deepEqual(oldLayer.state, newLayer.state)) return false;

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
 * @type {UpdateData|null}
 */
let data = null;

function handleMessage({ data: payload }) {
  if (pause) return;

  /**
   * @type {MessageData}
   */
  let incoming;

  try {
    incoming = JSON.parse(payload);
  } catch (_) {
    return;
  }

  if (incoming.type !== 'update') return;

  /**
   * @type {UpdateData}
   */
  const newData = incoming.data;

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

  const fullscreen = () => {
    // eslint-disable-next-line no-console
    document.documentElement.requestFullscreen().catch((error) => console.log(error));
  };

  fullscreen();
  document.documentElement.onclick = fullscreen;

  window.setInterval(() => {
    if (stream.readyState === stream.CLOSED) window.location.reload(true);
  }, 60000);
}
