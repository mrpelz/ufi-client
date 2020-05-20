/* eslint-disable default-case */
/* eslint-disable consistent-return */
/* eslint-disable getter-return */

/**
 * @typedef ClockOptions
 * @type {{
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
 * https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
 * @param {number} percent
 * @param {boolean} ascend
 */
function getPath(percent, ascend) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);

  const largeArc = (() => {
    if (ascend) return (percent > 0.5 ? '1' : '0');
    return (percent <= 0.5 ? '1' : '0');
  })();

  return [
    `M ${ascend ? 1 : x} ${ascend ? 0 : y}`,
    `A 1 1 0 ${largeArc} 1 ${ascend ? x : 1} ${ascend ? y : 0}`,
    'L 0 0',
  ].join(' ');
}

const svg = `
<svg id="clock" viewBox="-5.5 -5.5 11 11" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <svg viewBox="-1 -1 2 2" x="-5.5" y="-5.5" width="11" height="11">
    <path id="millennium" class="pie" fill="var(--color-millennium)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-5" y="-5" width="10" height="10">
    <path id="century" class="pie" fill="var(--color-century)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-4.5" y="-4.5" width="9" height="9">
    <path id="decade" class="pie" fill="var(--color-decade)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-4" y="-4" width="8" height="8">
    <path id="year" class="pie" fill="var(--color-year)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-3.5" y="-3.5" width="7" height="7">
    <path id="month" class="pie" fill="var(--color-month)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-3" y="-3" width="6" height="6">
    <path id="week" class="pie" fill="var(--color-week)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-2.5" y="-2.5" width="5" height="5">
    <path id="day" class="pie" fill="var(--color-day)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-2" y="-2" width="4" height="4">
    <path id="hours12" class="pie" fill="var(--color-hours12)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-1.5" y="-1.5" width="3" height="3">
    <path id="hour" class="pie" fill="var(--color-hour)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-1" y="-1" width="2" height="2">
    <path id="minute" class="pie" fill="var(--color-minute)" />
  </svg>
  <svg viewBox="-1 -1 2 2" x="-0.5" y="-0.5" width="1" height="1">
    <path id="second" class="pie" fill="var(--color-second)" />
  </svg>
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
      colorSecond: '#FF2600',
      colorMinute: '#FF9300',
      colorHour: '#FFFB00',
      colorHours12: '#00F900',
      colorDay: '#00FDFF',
      colorWeek: '#0096FF',
      colorMonth: '#0433FF',
      colorYear: '#9437FF',
      colorDecade: '#FF40FF',
      colorCentury: '#FF2F92',
      colorMillennium: '#FFFFFF'
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

      const elementSecond = root.getElementById('second');
      const elementMinute = root.getElementById('minute');
      const elementHour = root.getElementById('hour');
      const elementHours12 = root.getElementById('hours12');
      const elementDay = root.getElementById('day');
      const elementWeek = root.getElementById('week');
      const elementMonth = root.getElementById('month');
      const elementYear = root.getElementById('year');
      const elementDecade = root.getElementById('decade');
      const elementCentury = root.getElementById('century');
      const elementMillennium = root.getElementById('millennium');

      const checkTime = () => {
        const time = new Date();
        const now = time.getTime();

        const msRunningSecond = now - startTime.second(time).getTime();
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

        const pSecond = trimDecimals(msRunningSecond / totalTime.second);
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

        elementSecond.setAttribute('d', getPath(pSecond, Boolean(time.getSeconds() % 2)));
        elementMinute.setAttribute('d', getPath(pMinute, true));
        elementHour.setAttribute('d', getPath(pHour, true));
        elementHours12.setAttribute('d', getPath(pHours12, true));
        elementDay.setAttribute('d', getPath(pDay, true));
        elementWeek.setAttribute('d', getPath(pWeek, true));
        elementMonth.setAttribute('d', getPath(pMonth, true));
        elementYear.setAttribute('d', getPath(pYear, true));
        elementDecade.setAttribute('d', getPath(pDecade, true));
        elementCentury.setAttribute('d', getPath(pCentury, true));
        elementMillennium.setAttribute('d', getPath(pMillennium, true));

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
