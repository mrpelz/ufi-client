/* eslint-disable default-case */
/* eslint-disable consistent-return */
/* eslint-disable getter-return */

/**
 * @typedef ClockOptions
 * @type {{
 *   strokeWidth: number | null,
 *   colorSecond: string | null,
 *   colorMinute: string | null,
 *   colorHour: string | null,
 *   colorHours12: string | null,
 *   colorDay: string | null,
 *   colorWeek: string | null,
 *   colorMonth: string | null,
 *   colorYear: string | null,
 *   colorDecade: string | null,
 *   colorCentury: string | null
 *   colorMillennium: string | null
 * }}
 */

/**
 * @param {number} input
 * @param {number} decimals
 */
function trimDecimals(input, decimals = 6) {
  const trimmer = 10 ** decimals;
  return Math.round(input * trimmer) / trimmer;
}

/**
 * @param {Date} input
 */
function getWeekNumber(input) {
  const date = new Date(input.getTime());
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * @param {HTMLElement} ring
 * @param {HTMLElement} textPath
 * @param {HTMLElement} label
 * @param {HTMLElement | null} progress
 * @param {number} scale
 * @param {number} fontSize
 */
function setupElements(ring, textPath, label, progress, scale, fontSize) {
  const position = (-scale).toString();

  ring.setAttribute('x', position);
  ring.setAttribute('y', position);

  const textPathCorrection = scale - (fontSize / 2.5);
  const textRingMargin = trimDecimals(fontSize * 0.1);

  textPath.setAttribute('x', position);
  textPath.setAttribute('y', position);
  textPath.setAttribute('d', `M 0 -${textPathCorrection} A ${textPathCorrection} ${textPathCorrection} 0 1 1 -${textRingMargin} -${textPathCorrection}`);

  label.setAttribute('font-size', fontSize.toString());
  label.setAttribute('startOffset', '100%');

  if (!progress) return;

  progress.setAttribute('font-size', trimDecimals(fontSize * 0.5).toString());
  progress.setAttribute('startOffset', '0.5%');
}

/**
 * https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
 * @param {HTMLElement} path
 * @param {{ [x: string]: [number, number] }} previousArcs
 * @param {string} prop
 * @param {number} progress
 * @param {number} multiply
 */
function setPath(path, previousArcs, prop, progress, multiply) {
  const [xPrev, yPrev] = previousArcs[prop] || [];

  const xEnd = trimDecimals(Math.cos(2 * Math.PI * progress) * multiply);
  const yEnd = trimDecimals(Math.sin(2 * Math.PI * progress) * multiply);

  if (
    xPrev !== undefined
    && yPrev !== undefined
    && xPrev === xEnd
    && yPrev === yEnd
  ) return;

  previousArcs[prop] = [xEnd, yEnd];

  const largeArc = progress > 0.5 ? '1' : '0';

  const d = [
    `M ${multiply} ${0}`,
    `A ${multiply} ${multiply} 0 ${largeArc} 1 ${xEnd} ${yEnd}`
  ].join(' ');

  path.setAttribute('d', d);
}

/**
 * @param {HTMLElement} element
 * @param {{ [x: string]: string }} previousLabels
 * @param {string} prop
 * @param {string} text
 */
function setText(element, previousLabels, prop, text) {
  const previous = previousLabels[prop];

  if (previous !== undefined && previous === text) return;

  previousLabels[prop] = text;
  element.innerHTML = text;
}

const svg = `
<svg id="clock" viewBox="-6 -6 12 12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <path id="t-millennium" />
    <path id="t-century" />
    <path id="t-decade" />
    <path id="t-year" />
    <path id="t-month" />
    <path id="t-week" />
    <path id="t-day" />
    <path id="t-hours12" />
    <path id="t-hour" />
    <path id="t-minute" />
  </defs>

  <path id="r-millennium" />
  <text>
    <textPath class="label" id="l-millennium" href="#t-millennium"></textPath>
    <textPath class="progress" id="p-millennium" href="#t-millennium"></textPath>
  </text>

  <path id="r-century" />
  <text>
    <textPath class="label" id="l-century" href="#t-century"></textPath>
    <textPath class="progress" id="p-century" href="#t-century"></textPath>
  </text>

  <path id="r-decade" />
  <text>
    <textPath class="label" id="l-decade" href="#t-decade"></textPath>
    <textPath class="progress" id="p-decade" href="#t-decade"></textPath>
  </text>

  <path id="r-year" />
  <text>
    <textPath class="label" id="l-year" href="#t-year"></textPath>
    <textPath class="progress" id="p-year" href="#t-year"></textPath>
  </text>

  <path id="r-month" />
  <text>
    <textPath class="label" id="l-month" href="#t-month"></textPath>
    <textPath class="progress" id="p-month" href="#t-month"></textPath>
  </text>

  <path id="r-week" />
  <text>
    <textPath class="label" id="l-week" href="#t-week"></textPath>
    <textPath class="progress" id="p-week" href="#t-week"></textPath>
  </text>

  <path id="r-day" />
  <text>
    <textPath class="label" id="l-day" href="#t-day"></textPath>
    <textPath class="progress" id="p-day" href="#t-day"></textPath>
  </text>

  <path id="r-hours12" />
  <text>
    <textPath class="label" id="l-hours12" href="#t-hours12"></textPath>
    <textPath class="progress" id="p-hours12" href="#t-hours12"></textPath>
  </text>

  <path id="r-hour" />
  <text>
    <textPath class="label" id="l-hour" href="#t-hour"></textPath>
    <textPath class="progress" id="p-hour" href="#t-hour"></textPath>
  </text>

  <path id="r-minute" />
  <text>
    <textPath class="label" id="l-minute" href="#t-minute"></textPath>
    <!-- <textPath class="progress" id="p-minute" href="#t-minute"></textPath> -->
  </text>
</svg>
`.trim();

/**
 * @param {UfiLayerElement} element
 * @param {[
 *  {
 *    default: typeof ui
 *  },
 *  typeof import('../utils/time.js')
 * ]} esModules
 */
const ui = (element, esModules) => (
  new Promise((resolve) => {
    const root = element.shadowRoot;

    /**
     * @type {ClockOptions}
     */
    let options = {
      strokeWidth: 0.46,
      colorSecond: 'none',
      colorMinute: '#FF2600',
      colorHour: '#FF9300',
      colorHours12: '#FFFB00',
      colorDay: '#00F900',
      colorWeek: '#00FDFF',
      colorMonth: '#0096FF',
      colorYear: '#0433FF',
      colorDecade: '#9437FF',
      colorCentury: '#FF40FF',
      colorMillennium: '#FF2F92'
    };

    /**
     * @type {{ [x: string]: [number, number] }}
     */
    const previousArcs = {};

    /**
     * @type {{ [x: string]: string }}
     */
    const previousLabels = {};

    const [, { totalTime, startTime }] = esModules;

    const content = document.createRange().createContextualFragment(svg);
    requestAnimationFrame(() => {
      root.append(content);

      const ringMinute = root.getElementById('r-minute');
      const ringHour = root.getElementById('r-hour');
      const ringHours12 = root.getElementById('r-hours12');
      const ringDay = root.getElementById('r-day');
      const ringWeek = root.getElementById('r-week');
      const ringMonth = root.getElementById('r-month');
      const ringYear = root.getElementById('r-year');
      const ringDecade = root.getElementById('r-decade');
      const ringCentury = root.getElementById('r-century');
      const ringMillennium = root.getElementById('r-millennium');

      const textPathMinute = root.getElementById('t-minute');
      const textPathHour = root.getElementById('t-hour');
      const textPathHours12 = root.getElementById('t-hours12');
      const textPathDay = root.getElementById('t-day');
      const textPathWeek = root.getElementById('t-week');
      const textPathMonth = root.getElementById('t-month');
      const textPathYear = root.getElementById('t-year');
      const textPathDecade = root.getElementById('t-decade');
      const textPathCentury = root.getElementById('t-century');
      const textPathMillennium = root.getElementById('t-millennium');

      const labelMinute = root.getElementById('l-minute');
      const labelHour = root.getElementById('l-hour');
      const labelHours12 = root.getElementById('l-hours12');
      const labelDay = root.getElementById('l-day');
      const labelWeek = root.getElementById('l-week');
      const labelMonth = root.getElementById('l-month');
      const labelYear = root.getElementById('l-year');
      const labelDecade = root.getElementById('l-decade');
      const labelCentury = root.getElementById('l-century');
      const labelMillennium = root.getElementById('l-millennium');

      // const progressMinute = root.getElementById('p-minute');
      const progressHour = root.getElementById('p-hour');
      const progressHours12 = root.getElementById('p-hours12');
      const progressDay = root.getElementById('p-day');
      const progressWeek = root.getElementById('p-week');
      const progressMonth = root.getElementById('p-month');
      const progressYear = root.getElementById('p-year');
      const progressDecade = root.getElementById('p-decade');
      const progressCentury = root.getElementById('p-century');
      const progressMillennium = root.getElementById('p-millennium');

      const stateCallback = () => {

        /**
         * @type {ClockOptions}
         */
        const newOptions = (
          element.ufiState.data instanceof Object
          && element.ufiState.data
        ) || {};

        options = {
          ...options,
          ...newOptions
        };

        const {
          strokeWidth,
          colorSecond,
          colorMinute,
          colorHour,
          colorHours12,
          colorDay,
          colorWeek,
          colorMonth,
          colorYear,
          colorDecade,
          colorCentury,
          colorMillennium
        } = options;

        element.style.setProperty('--stroke-width', strokeWidth.toString() || '0');
        element.style.setProperty('--color-second', colorSecond || 'none');
        element.style.setProperty('--color-minute', colorMinute || 'none');
        element.style.setProperty('--color-hour', colorHour || 'none');
        element.style.setProperty('--color-hours12', colorHours12 || 'none');
        element.style.setProperty('--color-day', colorDay || 'none');
        element.style.setProperty('--color-week', colorWeek || 'none');
        element.style.setProperty('--color-month', colorMonth || 'none');
        element.style.setProperty('--color-year', colorYear || 'none');
        element.style.setProperty('--color-decade', colorDecade || 'none');
        element.style.setProperty('--color-century', colorCentury || 'none');
        element.style.setProperty('--color-millennium', colorMillennium || 'none');

        // setupElements(ringMinute, textPathMinute, labelMinute, progressMinute, 1, strokeWidth);
        setupElements(ringMinute, textPathMinute, labelMinute, null, 1, strokeWidth);
        setupElements(ringHour, textPathHour, labelHour, progressHour, 1.5, strokeWidth);
        setupElements(ringHours12, textPathHours12, labelHours12, progressHours12, 2, strokeWidth);
        setupElements(ringDay, textPathDay, labelDay, progressDay, 2.5, strokeWidth);
        setupElements(ringWeek, textPathWeek, labelWeek, progressWeek, 3, strokeWidth);
        setupElements(ringMonth, textPathMonth, labelMonth, progressMonth, 3.5, strokeWidth);
        setupElements(ringYear, textPathYear, labelYear, progressYear, 4, strokeWidth);
        setupElements(ringDecade, textPathDecade, labelDecade, progressDecade, 4.5, strokeWidth);
        setupElements(ringCentury, textPathCentury, labelCentury, progressCentury, 5, strokeWidth);
        setupElements(ringMillennium, textPathMillennium, labelMillennium, progressMillennium, 5.5, strokeWidth);
      };

      element.ufiStateCallback = stateCallback;
      stateCallback();

      const checkTime = () => {
        const time = new Date();
        const now = time.getTime();

        const msRunningMinute = now - startTime.minute(time).getTime();
        const msRunningHour = now - startTime.hour(time).getTime();
        const msRunningDay = now - startTime.day(time).getTime();
        const msRunningHours12 = msRunningDay < totalTime.hours12
          ? msRunningDay
          : msRunningDay - totalTime.hours12;
        const msRunningWeek = now - startTime.week(time).getTime();
        const msRunningMonth = now - startTime.month(time).getTime();
        const msRunningYear = now - startTime.year(time).getTime();
        const msRunningDecade = now - startTime.decade(time).getTime();
        const msRunningCentury = now - startTime.century.getTime();
        const msRunningMillennium = now - startTime.millennium.getTime();

        const pMinute = msRunningMinute / totalTime.minute;
        const pHour = msRunningHour / totalTime.hour;
        const pHours12 = msRunningHours12 / totalTime.hours12;
        const pDay = msRunningDay / totalTime.day;
        const pWeek = msRunningWeek / totalTime.week;
        const pMonth = msRunningMonth / totalTime.month(time);
        const pYear = msRunningYear / totalTime.year(time);
        const pDecade = msRunningDecade / totalTime.decade(time);
        const pCentury = msRunningCentury / totalTime.century;
        const pMillennium = msRunningMillennium / totalTime.millennium;

        setPath(ringMinute, previousArcs, 'minute', pMinute, 1);
        setPath(ringHour, previousArcs, 'hour', pHour, 1.5);
        setPath(ringHours12, previousArcs, 'hours12', pHours12, 2);
        setPath(ringDay, previousArcs, 'day', pDay, 2.5);
        setPath(ringWeek, previousArcs, 'week', pWeek, 3);
        setPath(ringMonth, previousArcs, 'month', pMonth, 3.5);
        setPath(ringYear, previousArcs, 'year', pYear, 4);
        setPath(ringDecade, previousArcs, 'decade', pDecade, 4.5);
        setPath(ringCentury, previousArcs, 'century', pCentury, 5);
        setPath(ringMillennium, previousArcs, 'millennium', pMillennium, 5.5);

        setText(labelMinute, previousLabels, 'label-minute', `${time.getMinutes().toString().padStart(2, '00')}`);
        setText(labelHour, previousLabels, 'label-hour', `${time.getHours().toString().padStart(2, '00')}:`);
        setText(labelHours12, previousLabels, 'label-hours12', time.getHours() < 12 ? 'AM' : 'PM');
        setText(labelDay, previousLabels, 'label-day', time.toLocaleString('de', { weekday: 'short', day: '2-digit' }));
        setText(labelWeek, previousLabels, 'label-week', `KW${getWeekNumber(time).toString().padStart(2, '00')}`);
        setText(labelMonth, previousLabels, 'label-month', `${time.toLocaleString('de', { month: 'long' })}`);
        setText(labelYear, previousLabels, 'label-year', `${time.getFullYear()}`);
        setText(labelDecade, previousLabels, 'label-decade', `${Math.floor(time.getFullYear() / 100)}er`);
        setText(labelCentury, previousLabels, 'label-century', `${Math.floor(time.getFullYear() / 100) + 1}. Jh.`);
        setText(labelMillennium, previousLabels, 'label-millennium', `${Math.floor(time.getFullYear() / 1000) + 1}. Jt.`);

        // setText(progressMinute, previousLabels, 'progress-minute', `${Math.floor(pMinute * 100).toString(10).padStart(2, '00')}%`);
        setText(progressHour, previousLabels, 'progress-hour', `${Math.floor(pHour * 100).toString(10).padStart(2, '00')}%`);
        setText(progressHours12, previousLabels, 'progress-hours12', `${Math.floor(pHours12 * 100).toString(10).padStart(2, '00')}%`);
        setText(progressDay, previousLabels, 'progress-day', `${Math.floor(pDay * 100).toString(10).padStart(2, '00')}%`);
        setText(progressWeek, previousLabels, 'progress-week', `${Math.floor(pWeek * 100).toString(10).padStart(2, '00')}%`);
        setText(progressMonth, previousLabels, 'progress-month', `${Math.floor(pMonth * 100).toString(10).padStart(2, '00')}%`);
        setText(progressYear, previousLabels, 'progress-year', `${Math.floor(pYear * 100).toString(10).padStart(2, '00')}%`);
        setText(progressDecade, previousLabels, 'progress-decade', `${Math.floor(pDecade * 100).toString(10).padStart(2, '00')}%`);
        setText(progressCentury, previousLabels, 'progress-century', `${Math.floor(pCentury * 100).toString(10).padStart(2, '00')}%`);
        setText(progressMillennium, previousLabels, 'progress-millennium', `${Math.floor(pMillennium * 100).toString(10).padStart(2, '00')}%`);

        if (document.body.contains(element)) requestAnimationFrame(checkTime);
      };

      requestAnimationFrame(() => {
        checkTime();
        resolve();
      });
    });
  })
);

export default ui;
