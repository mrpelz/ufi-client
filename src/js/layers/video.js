/**
 * @param {HTMLElement} element
 * @param {LayerData} _
 * @param {AssetData[]} assets
 */
export const videoLayer = (element, _, assets) => {
  const [videoAsset] = assets;

  const video = document.createElement('video');
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.src = videoAsset.url;

  window.requestAnimationFrame(() => {
    element.append(video);
    video.play();
  });
};
