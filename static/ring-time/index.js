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
 */
function trimDecimals(input) {
  const trimmer = 10 ** 6;
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
 * https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
 * @param {number} percent
 * @param {number} multiply
 */
function getPath(percent, multiply) {
  const xEnd = Math.cos(2 * Math.PI * percent) * multiply;
  const yEnd = Math.sin(2 * Math.PI * percent) * multiply;

  const largeArc = percent > 0.5 ? '1' : '0';

  return [
    `M ${multiply} ${0}`,
    `A ${multiply} ${multiply} 0 ${largeArc} 1 ${xEnd} ${yEnd}`
  ].join(' ');
}

/**
 * @param {HTMLElement} ring
 * @param {HTMLElement} textPath
 * @param {number} progress
 * @param {number} scale
 * @param {number} fontSize
 */
function setPaths(ring, textPath, progress, scale, fontSize) {
  const position = (-scale).toString();

  ring.setAttribute('x', position);
  ring.setAttribute('y', position);
  ring.setAttribute('d', getPath(progress, scale));

  const textPathCorrection = scale - (fontSize / 2.5);
  const textRingMargin = fontSize * 0.1;

  textPath.setAttribute('x', position);
  textPath.setAttribute('y', position);
  textPath.setAttribute('d', `M 0 -${textPathCorrection} A ${textPathCorrection} ${textPathCorrection} 0 1 1 -${textRingMargin} -${textPathCorrection}`);
}

/**
 * @param {HTMLElement} label
 * @param {number} fontSize
 * @param {string} text
 */
function setLabel(label, fontSize, text) {
  label.setAttribute('font-size', fontSize.toString());
  label.setAttribute('startOffset', '100%');

  label.innerHTML = text;
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
    <textPath id="l-millennium" href="#t-millennium"></textPath>
  </text>

  <path id="r-century" />
  <text>
    <textPath id="l-century" href="#t-century"></textPath>
  </text>

  <path id="r-decade" />
  <text>
    <textPath id="l-decade" href="#t-decade"></textPath>
  </text>

  <path id="r-year" />
  <text>
    <textPath id="l-year" href="#t-year"></textPath>
  </text>

  <path id="r-month" />
  <text>
    <textPath id="l-month" href="#t-month"></textPath>
  </text>

  <path id="r-week" />
  <text>
    <textPath id="l-week" href="#t-week"></textPath>
  </text>

  <path id="r-day" />
  <text>
    <textPath id="l-day" href="#t-day"></textPath>
  </text>

  <path id="r-hours12" />
  <text>
    <textPath id="l-hours12" href="#t-hours12"></textPath>
  </text>

  <path id="r-hour" />
  <text>
    <textPath id="l-hour" href="#t-hour"></textPath>
  </text>

  <path id="r-minute" />
  <text>
    <textPath id="l-minute" href="#t-minute"></textPath>
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
      strokeWidth: 0.4,
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
    };

    element.ufiStateCallback = stateCallback;
    stateCallback();

    const [, { totalTime, startTime }] = esModules;

    const content = document.createRange().createContextualFragment(svg);
    window.requestAnimationFrame(() => {
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

      const checkTime = () => {
        const { strokeWidth } = options;

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

        const pMinute = trimDecimals(msRunningMinute / totalTime.minute);
        const pHour = trimDecimals(msRunningHour / totalTime.hour);
        const pDay = trimDecimals(msRunningDay / totalTime.day);
        const pHours12 = trimDecimals(msRunningHours12 / totalTime.hours12);
        const pWeek = trimDecimals(msRunningWeek / totalTime.week);
        const pMonth = trimDecimals(msRunningMonth / totalTime.month(time));
        const pYear = trimDecimals(msRunningYear / totalTime.year(time));
        const pDecade = trimDecimals(msRunningDecade / totalTime.decade(time));
        const pCentury = trimDecimals(msRunningCentury / totalTime.century);
        const pMillennium = trimDecimals(msRunningMillennium / totalTime.millennium);

        setPaths(ringMinute, textPathMinute, pMinute, 1, strokeWidth);
        setPaths(ringHour, textPathHour, pHour, 1.5, strokeWidth);
        setPaths(ringHours12, textPathHours12, pHours12, 2, strokeWidth);
        setPaths(ringDay, textPathDay, pDay, 2.5, strokeWidth);
        setPaths(ringWeek, textPathWeek, pWeek, 3, strokeWidth);
        setPaths(ringMonth, textPathMonth, pMonth, 3.5, strokeWidth);
        setPaths(ringYear, textPathYear, pYear, 4, strokeWidth);
        setPaths(ringDecade, textPathDecade, pDecade, 4.5, strokeWidth);
        setPaths(ringCentury, textPathCentury, pCentury, 5, strokeWidth);
        setPaths(ringMillennium, textPathMillennium, pMillennium, 5.5, strokeWidth);

        setLabel(labelMinute, strokeWidth, `${time.getMinutes().toString().padStart(2, '00')}`);
        setLabel(labelHour, strokeWidth, `${time.getHours().toString().padStart(2, '00')}:`);
        setLabel(labelHours12, strokeWidth, time.getHours() < 12 ? 'AM' : 'PM');
        setLabel(labelDay, strokeWidth, time.toLocaleString('de', { weekday: 'short', day: '2-digit' }));
        setLabel(labelWeek, strokeWidth, `KW${getWeekNumber(time).toString().padStart(2, '00')}`);
        setLabel(labelMonth, strokeWidth, `${time.toLocaleString('de', { month: 'long' })}`);
        setLabel(labelYear, strokeWidth, `${time.getFullYear()}`);
        setLabel(labelDecade, strokeWidth, `${Math.floor(time.getFullYear() / 100)}er`);
        setLabel(labelCentury, strokeWidth, `${Math.floor(time.getFullYear() / 100) + 1}. Jh.`);
        setLabel(labelMillennium, strokeWidth, `${Math.floor(time.getFullYear() / 1000) + 1}. Jt.`);

        if (document.body.contains(element)) window.requestAnimationFrame(checkTime);
      };

      window.requestAnimationFrame(() => {
        checkTime();
        resolve();
      });
    });
  })
);

export default ui;
