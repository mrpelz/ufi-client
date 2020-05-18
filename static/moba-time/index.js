/* eslint-disable default-case */
/* eslint-disable consistent-return */
/* eslint-disable getter-return */

/**
 * @typedef ClockOptions
 * @type {{
 *  style: {
 *    borderColor: string | null | undefined,
 *    borderWidth: number | null | undefined,
 *    centerColor: string | null,
 *    faceColor: string | null,
 *    fillColor: string | null,
 *    hoursHandColor: string | null,
 *    labelColor: string | null,
 *    minutesHandColor: string | null,
 *    secondsHandColor: string | null | undefined
 *  },
 *  config: {
 *    design: 'moba' | 'classic',
 *    msDSTStepDuration: number,
 *    msSyncPause: number,
 *    msTransitionDuration: number,
 *    trackHoursHand: 'hours' | 'minutes' | 'seconds' | 'frames',
 *    trackMinutesHand: 'minutes' | 'seconds' | 'frames',
 *    trackSecondsHand: 'seconds' | 'frames'
 *  }
 * }}
 */

const DEG_CIRCLE = 360;
const MS_12_HOURS = 43200000;
const MS_1_HOUR = 3600000;
const MS_1_MINUTE = 60000;
const MS_1_SECOND = 1000;
const MS_DST_BACKWARD = 39600000;
const MS_DST_FORWARD = 3600000;

const svg = {
  moba: `
<!-- https://commons.wikimedia.org/wiki/File:Swiss_railway_clock_1.svg -->
<svg id="clock" viewBox="-1136 -1136 2272 2272" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <path id="mark-large" d="M -40,-1000 l 80,0 0,245 -80,0 z" />
    <path id="mark-small" d="M -15,-1000 l 30,0 0,80 -30,0 z" />
    <path id="hand-hours" d="M -50,-650 l 100,0 10,890 -120,0 z" />
    <path id="hand-minutes" d="M -40,-950 l 80,0 10,1200 -100,0 z" />
    <path id="hand-seconds" d="m 0,-750 a 105,105 0 0 1 0,210 105,105 0 0 1 0,-210 z m -20,200 h 30 l 7,890 h -30 z" />
    <g id="face-5min">
      <use xlink:href="#mark-large" />
      <use xlink:href="#mark-small" transform="rotate(06)" />
      <use xlink:href="#mark-small" transform="rotate(12)" />
      <use xlink:href="#mark-small" transform="rotate(18)" />
      <use xlink:href="#mark-small" transform="rotate(24)" />
    </g>
    <g id="face-15min">
      <use xlink:href="#face-5min" />
      <use xlink:href="#face-5min" transform="rotate(30)" />
      <use xlink:href="#face-5min" transform="rotate(60)" />
    </g>
    <g id="face-full">
      <use xlink:href="#face-15min" />
      <use xlink:href="#face-15min" transform="rotate(90)" />
      <use xlink:href="#face-15min" transform="rotate(180)" />
      <use xlink:href="#face-15min" transform="rotate(270)" />
    </g>
    <g id="label">
      <path
        d="m 93.9,489 0,3.8 5,0 -5,-3.8 z m -6.7,-4.9 0,8.7 3.3,0 0,-6.2 -3.3,-2.5 z m -6.7,-4.9 0,13.7 3.3,0 0,-11.2 -3.3,-2.5 z m -6.6,-5 0,18.6 3.3,0 0,-16.1 -3.3,-2.5 z m -73.3,-3 0,21.6 c 1.2,0 2,0 3.3,-0.1 l 0,-21.7 c -1.1,0.1 -2.2,0.2 -3.3,0.2 m 6.6,-0.7 0,22 c 1.3,-0.1 1.9,-0.2 3.3,-0.4 l 0,-22.2 c -1,0.2 -2.1,0.5 -3.3,0.6 m 59.9,-1.4 0,23.6 3.4,0 0,-21.1 -3.4,-2.5 z m -53.2,-0.3 0,22.6 c 1,-0.2 2.2,-0.5 3.3,-0.8 l 0,-23.1 c -1.3,0.6 -2.1,0.9 -3.3,1.2 m 6.6,-2.8 0,23.6 c 1.1,-0.4 2.1,-0.7 3.3,-1.2 l 0,-24.4 c -1.3,0.8 -2.1,1.3 -3.3,1.9 m 39.9,-1.9 0,26.4 3.3,2.2 0,-26.1 -3.3,-2.5 z m -33.3,-2.3 0,25.2 c 1.1,-0.5 2.2,-1.1 3.3,-1.8 l 0,-26.1 c -1.3,1.2 -2.2,1.8 -3.3,2.7 m 26.6,-2.6 0,26.9 3.3,2.2 0,-26.6 -3.3,-2.5 z m -6.6,-4.9 0,27.4 3.3,2.2 0,-27.1 -3.3,-2.5 z m -10,-2 c -1.4,1.7 -1.9,2.1 -3.3,3.7 l 0,27.1 c 1.2,-1 2.2,-1.8 3.3,-2.8 l 0,-28 z m 3.3,-2.9 0,27.9 3.3,2.2 0,-27.7 -3.3,-2.5 z m -136.5,39.7 0,3.8 -5,0 5,-3.8 z m 6.7,-4.9 -0,8.7 -3.3,0 0,-6.2 3.4,-2.5 z m 6.6,-4.9 0,13.7 -3.3,0 0,-11.2 3.3,-2.5 z m 6.7,-5 -0,18.6 -3.3,0 0,-16.1 3.3,-2.5 z m 73.3,-3 0,21.6 c -1.2,0 -2,0 -3.3,-0.1 l 0,-21.7 c 1.1,0.1 2.2,0.2 3.3,0.2 m -6.6,-0.7 0,22 c -1.3,-0.1 -2,-0.2 -3.3,-0.4 l 0,-22.2 c 1,0.2 2.1,0.5 3.3,0.6 m -59.9,-1.4 -0,23.6 -3.4,0 -0,-21.1 3.4,-2.5 z m 53.2,-0.3 0,22.6 c -1,-0.2 -2.2,-0.5 -3.3,-0.8 l 0,-23.1 c 1.3,0.6 2.1,0.9 3.3,1.2 m -6.6,-2.8 0,23.6 c -1.1,-0.4 -2.1,-0.7 -3.3,-1.2 l 0,-24.4 c 1.4,0.8 2.1,1.3 3.3,1.9 m -39.9,-1.9 0,26.4 -3.3,2.2 0,-26.1 3.3,-2.5 z m 33.3,-2.3 0,25.2 c -1.1,-0.5 -2.2,-1.1 -3.3,-1.8 l 0,-26.1 c 1.3,1.2 2.1,1.8 3.3,2.7 m -26.6,-2.6 0,26.9 -3.3,2.2 0,-26.6 3.3,-2.5 z m 6.7,-4.9 -0,27.4 -3.3,2.2 0,-27.1 3.3,-2.5 z m 9.9,-2 c 1.4,1.7 1.9,2.1 3.3,3.7 l 0,27.1 c -1.2,-1 -2.2,-1.8 -3.3,-2.8 l 0,-28 z m -3.3,-2.9 0,27.9 -3.3,2.2 0,-27.7 3.3,-2.5 z m 38.6,-94.5 c 52,0 84.5,46.2 66.9,95.6 L 44.2,438 c 7.5,-28.5 -10.7,-61.1 -46.7,-60.8 -31.6,2 -50.9,28.6 -44.1,60.4 l -18.6,12 c -18.5,-46.6 13.5,-91.8 61.2,-94.8"
      />
      <path
        d="m -0.5,502.6 -5.7,0 -9,23.4 5.6,0 1.8,-3.6 9.1,0 1.8,3.5 5.4,0 -8.9,-23.4 z m -2.8,6.5 2.7,9.1 -5.3,0 2.6,-9.1 z m -36.4,-6.5 -8.4,0 0,23.4 10.2,0 c 2.6,0 5.9,-2.5 6.5,-5.7 0.1,-3.4 -1.4,-6.4 -3.9,-6.8 1.4,-0.6 2.4,-2.9 2.2,-5.9 -0.4,-3 -3.7,-5.2 -6.6,-5 m 1.6,5.7 c 0.6,1 0.2,2 -0.1,2.8 -1.1,1.2 -3,1.1 -4.5,1.1 l 0,-5.1 c 1.4,0 3.7,-0.2 4.6,1.2 m 1,8.8 c 0.6,0.9 0.5,2.7 0.2,3.3 -1.4,1.5 -3.5,1.5 -5.7,1.2 l 0,-5.5 c 2.6,-0.2 4,-0.1 5.5,1 m -71,-14.5 3.9,23.3 -4.9,0.1 -2.3,-13.6 -6.1,13.6 -1.5,-0.1 -6,-13 -2.5,13.1 -5.2,-0.1 3.8,-23.4 5.1,0 5.1,13.4 5.5,-13.3 4.9,0 z m 31.2,17.9 c -3.7,0 -6.8,-3.1 -6.8,-6.8 0,-3.7 3.1,-6.8 6.8,-6.8 3.7,0 6.8,3.1 6.8,6.8 0,3.7 -3.1,6.8 -6.8,6.8 m 0,5.5 c 6.9,0 12.6,-5.5 12.6,-12.3 0,-6.8 -5.7,-12.3 -12.6,-12.3 -6.9,0 -12.6,5.5 -12.6,12.3 0,6.8 5.7,12.3 12.6,12.3 m 104.3,-22.4 13.9,0 -0.5,2.6 -5.7,0 -3.1,19.7 -2.8,0 3.1,-19.7 -5.5,0 0.5,-2.6 z m 30.2,0 2.8,0 -3.6,22.3 -2.8,0 3.5,-22.3 z m 39.7,-1.6 1.2,23.9 -3.2,0 -0.2,-15.2 -9.6,15.7 -4.4,-15.7 -5.1,15.2 -3.2,0 8.8,-23.9 4.9,18.1 10.8,-18.1 z m 29.6,1.6 -0.7,2.6 -9.2,0 -1,6.3 9,0 -0.5,2.5 -8.9,0 -1.4,8.4 9.4,0 -0.5,2.6 -12.2,0 3.5,-22.3 12.5,0 z"
      />
    </g>
    <circle id="base" r="1104" />
    <circle id="center" r="5" />
  </defs>
  <use xlink:href="#base" />
  <use xlink:href="#label" />
  <use xlink:href="#face-full" />
  <use xlink:href="#hand-hours" id="handle-hours" />
  <use xlink:href="#hand-minutes" id="handle-minutes" />
  <use xlink:href="#hand-seconds" id="handle-seconds" />
  <use xlink:href="#center" />
</svg>
  `.trim(),
  classic: `
<!-- https://commons.wikimedia.org/wiki/File:Swiss_railway_clock.svg -->
<svg id="clock" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-1024 -1024 2048 2048">
  <defs>
    <path id="mark-large" d="M-40-1000h80v300h-80z"/>
    <path id="mark-middle" d="M-40-1000h80v240h-80z"/>
    <path id="mark-small" d="M-20-1000h40v100h-40z"/>
    <path id="hand-hours" d="M-50-600l50-50 50 50v800H-50z"/>
    <path id="hand-minutes" d="M-40-900l40-40 40 40V280h-80z"/>
    <path id="hand-seconds" d="m 0,-620 a 120,120 0 0 1 0,240 120,120 0 0 1 0,-240 z m 0,60 a 60,60 0 0 0 0,120 60,60 0 0 0 0,-120 z m -10,-350 10,-10 10,10 2,300 h -24 z m -3,520 h 26 l 7,690 h -40 z" />
    <g id="face-5min">
      <use xlink:href="#mark-small" transform="rotate(6)" />
      <use xlink:href="#mark-small" transform="rotate(12)" />
      <use xlink:href="#mark-small" transform="rotate(18)" />
      <use xlink:href="#mark-small" transform="rotate(24)" />
    </g>
    <g id="face-15min">
      <use xlink:href="#face-5min" />
      <use xlink:href="#face-5min" transform="rotate(30)" />
      <use xlink:href="#face-5min" transform="rotate(60)" />
      <use xlink:href="#mark-large" />
      <use xlink:href="#mark-middle" transform="rotate(30)" />
      <use xlink:href="#mark-middle" transform="rotate(60)" />
    </g>
    <g id="face-full">
      <use xlink:href="#face-15min" />
      <use xlink:href="#face-15min" transform="rotate(90)" />
      <use xlink:href="#face-15min" transform="rotate(180)" />
      <use xlink:href="#face-15min" transform="rotate(270)" />
    </g>
    <circle id="base" r="1024" />
  </defs>
  <use xlink:href="#base" />
  <use xlink:href="#face-full" />
  <use xlink:href="#hand-hours" id="handle-hours" />
  <use xlink:href="#hand-minutes" id="handle-minutes" />
  <use xlink:href="#hand-seconds" id="handle-seconds" />
</svg>
  `.trim()
};

/**
 * @param {number} input
 */
function wrap(input) {
  const wrapped = input % 1;

  return wrapped < 0 ? wrapped + 1 : wrapped;
}

/**
 * @param {Date} time
 */
function dstType(time) {
  const reference = new Date();
  reference.setTime(time.getTime());
  reference.setUTCHours(time.getUTCHours() - 1);

  const offset = time.getTimezoneOffset();
  const offsetReference = reference.getTimezoneOffset();

  if (offset === offsetReference) return null;

  return (offsetReference - offset) * MS_1_MINUTE;
}

/**
 * @param {UfiLayerElement} element
 * @param {[
 *  {
 *    default: typeof ui
 *  },
 *  {
 *    default: typeof import('../utils/easing.js')['default']
 *  }
 * ]} esModules
 */
const ui = (element, esModules) => (
  new Promise((resolve) => {
    const root = element.shadowRoot;

    /**
     * @type {ClockOptions}
     */
    let options = {
      style: {
        borderColor: undefined, // default handling below
        borderWidth: undefined, // default handling below
        centerColor: 'gold',
        faceColor: 'black',
        fillColor: 'white',
        hoursHandColor: 'black',
        labelColor: 'black',
        minutesHandColor: 'black',
        secondsHandColor: undefined // default handling below
      },
      config: {
        design: 'moba',
        msDSTStepDuration: 500,
        msSyncPause: 1500,
        msTransitionDuration: 250,
        trackHoursHand: 'minutes',
        trackMinutesHand: 'minutes',
        trackSecondsHand: 'frames'
      }
    };

    /**
     * @type {HTMLElement}
     */
    let elementSecondsHand;

    /**
     * @type {HTMLElement}
     */
    let elementMinutesHand;

    /**
     * @type {HTMLElement}
     */
    let elementHoursHand;

    const stateCallback = () => {

      /**
       * @type {ClockOptions}
       */
      const newOptions = (
        element.ufiState.data instanceof Object
        && element.ufiState.data
      ) || {};

      options = {
        style: {
          ...options.style,
          ...newOptions.style
        },
        config: {
          ...options.config,
          ...newOptions.config
        }
      };

      const {
        borderColor,
        borderWidth,
        centerColor,
        faceColor,
        fillColor,
        hoursHandColor,
        labelColor,
        minutesHandColor,
        secondsHandColor
      } = options.style;

      const { design } = options.config;

      element.style.setProperty('--border-color', (() => {
        if (borderColor === null || design === 'classic') return 'none';
        if (borderColor === undefined) return 'lightgrey';
        return secondsHandColor;
      })());

      element.style.setProperty('--border-width', (() => {
        if (borderWidth === null || design === 'classic') return '0';
        if (borderWidth === undefined) return '64';
        return borderWidth.toString();
      })());

      element.style.setProperty('--seconds-hand-color', (() => {
        if (secondsHandColor === null) return 'none';
        if (secondsHandColor === undefined) {
          return design === 'classic' ? '#AA0000' : '#BD2420';
        }
        return secondsHandColor;
      })());

      element.style.setProperty('--center-color', centerColor || 'none');
      element.style.setProperty('--face-color', faceColor || 'none');
      element.style.setProperty('--fill-color', fillColor || 'none');
      element.style.setProperty('--label-color', labelColor || 'none');
      element.style.setProperty('--hours-hand-color', hoursHandColor || 'none');
      element.style.setProperty('--minutes-hand-color', minutesHandColor || 'none');

      const content = document.createRange().createContextualFragment(svg[design]);
      window.requestAnimationFrame(() => {
        const clock = root.getElementById('clock');
        if (clock) clock.remove();

        root.append(content);

        elementSecondsHand = root.getElementById('handle-seconds');
        elementMinutesHand = root.getElementById('handle-minutes');
        elementHoursHand = root.getElementById('handle-hours');
      });
    };

    element.ufiStateCallback = stateCallback;
    stateCallback();

    const [, { default: cubicBezier }] = esModules;
    const transitionSlowHands = cubicBezier(0.4, 2.08, 0.55, 0.44);
    const transitionSecondsHandStop = cubicBezier(0, 0, 0.58, 1);
    const transitionSecondsHandStart = cubicBezier(0.42, 0, 1, 1);

    const checkTime = () => {
      if (
        (
          !elementSecondsHand
          || !elementMinutesHand
          || !elementHoursHand
        ) && document.body.contains(element)
      ) {
        window.requestAnimationFrame(checkTime);
        return;
      }

      const {
        msDSTStepDuration,
        msSyncPause,
        msTransitionDuration,
        trackHoursHand,
        trackMinutesHand,
        trackSecondsHand
      } = options.config;

      const time = new Date();

      const dst = dstType(time);

      const ms = time.getMilliseconds();

      const s = time.getSeconds();
      const msSeconds = s * MS_1_SECOND;
      const msSecondsFrames = msSeconds + ms;

      const mRaw = time.getMinutes();

      const msDSTTransitionBase = ((mRaw * MS_1_MINUTE) + msSecondsFrames);
      const msDSTTransitionTime = (() => {
        if (!msDSTStepDuration || !dst) return null;

        const handTransition = (
          (dst > 0 ? MS_DST_FORWARD : MS_DST_BACKWARD) / MS_1_MINUTE
        ) * msDSTStepDuration;

        const handDrift = (
          handTransition / MS_1_MINUTE
        ) * msDSTStepDuration;

        const result = handTransition + handDrift;

        return msDSTTransitionBase > result ? null : result;
      })();

      const m = (() => {
        if (
          !msDSTTransitionTime
          || msDSTTransitionBase > msDSTTransitionTime
        ) return mRaw;

        const result = Math.floor(
          (
            msDSTTransitionBase / msDSTTransitionTime
          ) * (
            msDSTTransitionTime / MS_1_MINUTE
          ) * (
            MS_1_MINUTE / msDSTStepDuration
          )
        );

        return result;
      })();
      const msMinutes = m * MS_1_MINUTE;

      const hRaw = time.getHours();

      const h = (() => {
        if (
          !msDSTTransitionTime
          || msDSTTransitionBase > msDSTTransitionTime
        ) return hRaw;

        return dst > 0 ? hRaw - 1 : hRaw + 1;
      })();
      const msHours = h * MS_1_HOUR;

      /**
       * @param {number} from
       * @param {number} to
       * @param {number} timeBase
       */
      const animate = (
        from,
        to,
        timeBase
      ) => {
        if (!msTransitionDuration || timeBase > msTransitionDuration) return to;

        const pAnimation = transitionSlowHands(
          timeBase / msTransitionDuration
        );

        return from + (Math.abs(from - to) * pAnimation);
      };

      /**
       * @param {number} timeBase
       */
      const animationTimeDST = (timeBase) => (
        msDSTTransitionTime
          ? (timeBase % msDSTStepDuration)
          : timeBase
      );

      const p = {
        get seconds() {
          const msSecondsHandTraversal = MS_1_MINUTE - msSyncPause;

          if (msSyncPause) {
            const pTransitionPath = msTransitionDuration / msSecondsHandTraversal;

            if (msSecondsFrames < msTransitionDuration) {
              const pAnimation = transitionSecondsHandStart(
                msSecondsFrames / msTransitionDuration
              );

              return pTransitionPath * pAnimation;
            }

            if (msSecondsFrames > msSecondsHandTraversal) {
              return 0;
            }

            if (msSecondsFrames > (msSecondsHandTraversal - msTransitionDuration)) {
              const pAnimation = transitionSecondsHandStop(
                (
                  msSecondsFrames - (msSecondsHandTraversal - msTransitionDuration)
                ) / msTransitionDuration
              );

              return (
                (
                  msSecondsHandTraversal - msTransitionDuration
                ) / msSecondsHandTraversal
              ) + (pTransitionPath * pAnimation);
            }
          }

          switch (trackSecondsHand) {
            case 'seconds':
              return animate(
                ((s - 1) * MS_1_SECOND) / msSecondsHandTraversal,
                msSeconds / msSecondsHandTraversal,
                ms
              );
            case 'frames':
              return msSecondsFrames / msSecondsHandTraversal;
          }
        },
        get minutes() {
          switch (trackMinutesHand) {
            case 'minutes':
              return animate(
                ((m - 1) * MS_1_MINUTE) / MS_1_HOUR,
                msMinutes / MS_1_HOUR,
                animationTimeDST(msSecondsFrames)
              );
            case 'seconds':
              return animate(
                (msMinutes + ((s - 1) * MS_1_SECOND)) / MS_1_HOUR,
                (msMinutes + msSeconds) / MS_1_HOUR,
                animationTimeDST(ms)
              );
            case 'frames':
              return (msMinutes + msSecondsFrames) / MS_1_HOUR;
          }
        },
        get hours() {

          /**
           * @param {number} pHours
           */
          const hoursHand = (pHours) => (pHours < 1 ? pHours : pHours - 1);

          return hoursHand((() => {
            switch (trackHoursHand) {
              case 'hours':
                return animate(
                  ((h - 1) * MS_1_HOUR) / MS_12_HOURS,
                  msHours / MS_12_HOURS,
                  animationTimeDST(msMinutes + msSecondsFrames)
                );
              case 'minutes':
                return animate(
                  (msHours + ((m - 1) * MS_1_MINUTE)) / MS_12_HOURS,
                  (msHours + msMinutes) / MS_12_HOURS,
                  animationTimeDST(msSecondsFrames)
                );
              case 'seconds':
                return animate(
                  (msHours + msMinutes + ((s - 1) * MS_1_SECOND)) / MS_12_HOURS,
                  (msHours + msMinutes + msSeconds) / MS_12_HOURS,
                  animationTimeDST(ms)
                );
              case 'frames':
                return (msHours + msMinutes + msSecondsFrames) / MS_12_HOURS;
            }
          })());
        }
      };

      const degSeconds = wrap(p.seconds) * DEG_CIRCLE;
      const degMinutes = wrap(p.minutes) * DEG_CIRCLE;
      const degHours = wrap(p.hours) * DEG_CIRCLE;

      elementSecondsHand.style.transform = `rotate(${degSeconds}deg)`;
      elementMinutesHand.style.transform = `rotate(${degMinutes}deg)`;
      elementHoursHand.style.transform = `rotate(${degHours}deg)`;

      if (document.body.contains(element)) window.requestAnimationFrame(checkTime);
    };

    window.requestAnimationFrame(() => {
      checkTime();
      resolve();
    });
  })
);

export default ui;
