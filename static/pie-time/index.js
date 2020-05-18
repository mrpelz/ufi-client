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

// const DEG_CIRCLE = 360;
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const HOUR_12 = HOUR * 12;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/**
 * @param {number} input
 */
// function trimDecimals(input) {
//   const trimmer = 10 ** 6;
//   return Math.round(input * trimmer) / trimmer;
// }

const totalTime = {
  second: SECOND,
  minute: MINUTE,
  hour: HOUR,
  hours12: HOUR_12,
  day: DAY,
  week: WEEK,

  /**
   * @param {Date} time
   */
  month(time) {
    const daysInMonth = new Date(
      time.getFullYear(),
      time.getMonth() + 1,
      0,
    ).getDate();

    return DAY * daysInMonth;
  },

  /**
   * @param {Date} time
   */
  year(time) {
    const year = time.getFullYear();

    /* eslint-disable-next-line no-bitwise */
    const daysInYear = ((year & 3 || !(year % 25)) && year & 15)
      ? 365
      : 366;

    return DAY * daysInYear;
  },

  /**
   * @param {Date} time
   */
  decade(time) {
    const year = time.getFullYear();
    const decadeStart = Math.floor(year / 10) * 10;
    const decadeEnd = (Math.ceil((year + 0.1) / 10) * 10) - 1;

    let ms = 0;

    for (
      let runningYear = decadeStart;
      runningYear <= decadeEnd;
      runningYear += 1
    ) {
      ms += this.year(new Date(runningYear, 0));
    }

    return ms;
  },

  /**
   * @param {Date} time
   */
  century(time) {
    const year = time.getFullYear();
    const centuryStart = Math.floor(year / 100) * 100;
    const centuryEnd = (Math.ceil((year + 0.1) / 100) * 100) - 1;

    let ms = 0;

    for (
      let runningDecade = centuryStart;
      runningDecade <= centuryEnd;
      runningDecade += 10
    ) {
      ms += this.decade(new Date(runningDecade, 0));
    }

    return ms;
  },

  /**
   * @param {Date} time
   */
  millennium(time) {
    const year = time.getFullYear();
    const millenniumStart = Math.floor(year / 1000) * 1000;
    const millenniumEnd = (Math.ceil((year + 0.1) / 1000) * 1000) - 1;

    let ms = 0;

    for (
      let runningCentury = millenniumStart;
      runningCentury <= millenniumEnd;
      runningCentury += 100
    ) {
      ms += this.century(new Date(runningCentury, 0));
    }

    return ms;
  }
};

const startTime = {

  /**
   * @param {Date} time
   */
  second(time) {
    const result = new Date(time.getTime());
    result.setMilliseconds(0);
    return result;
  },

  /**
   * @param {Date} time
   */
  minute(time) {
    const result = new Date(time.getTime());
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
  },

  /**
   * @param {Date} time
   */
  hour(time) {
    const result = new Date(time.getTime());
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
  },

  /**
   * @param {Date} time
   */
  day(time) {
    const result = new Date(time.getTime());
    result.setHours(0, 0, 0, 0);
    return result;
  },

  /**
   * @param {Date} time
   */
  week(time) {
    const result = new Date(time.getTime());
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - result.getDay() + 1);
    return result;
  },

  /**
   * @param {Date} time
   */
  month(time) {
    const result = new Date(time.getTime());
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  /**
   * @param {Date} time
   */
  year(time) {
    const result = new Date(time.getTime());
    result.setMonth(0);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  /**
   * @param {Date} time
   */
  decade(time) {
    const year = time.getFullYear();
    const decadeStart = Math.floor(year / 10) * 10;
    return new Date(decadeStart, 0);
  },

  /**
   * @param {Date} time
   */
  century(time) {
    const year = time.getFullYear();
    const centuryStart = Math.floor(year / 100) * 100;
    return new Date(centuryStart, 0);
  },

  /**
   * @param {Date} time
   */
  millennium(time) {
    const year = time.getFullYear();
    const millenniumStart = Math.floor(year / 1000) * 1000;
    return new Date(millenniumStart, 0);
  }
};

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
 */
const ui = (element) => (
  new Promise((resolve) => {
    const root = element.shadowRoot;

    /**
     * @type {ClockOptions}
     */
    let options = {
      colorSecond: '#FF0000',
      colorMinute: '#994C00',
      colorHour: '#999900',
      colorHours12: '#4C9900',
      colorDay: '#009999',
      colorWeek: '#004C99',
      colorMonth: '#000099',
      colorYear: '#4C0099',
      colorDecade: '#990099',
      colorCentury: '#99004C',
      colorMillennium: '#404040'
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
        const msRunningCentury = now - startTime.century(time).getTime();
        const msRunningMillennium = now - startTime.millennium(time).getTime();

        const pSecond = msRunningSecond / totalTime.second;
        const pMinute = msRunningMinute / totalTime.minute;
        const pHour = msRunningHour / totalTime.hour;
        const pDay = msRunningDay / totalTime.day;
        const pHours12 = msRunningHours12 / totalTime.hours12;
        const pWeek = msRunningWeek / totalTime.week;
        const pMonth = msRunningMonth / totalTime.month(time);
        const pYear = msRunningYear / totalTime.year(time);
        const pDecade = msRunningDecade / totalTime.decade(time);
        const pCentury = msRunningCentury / totalTime.century(time);
        const pMillennium = msRunningMillennium / totalTime.millennium(time);

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
