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

export const totalTime = {
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

export const startTime = {

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
