const transitionDuration = 200;
const transitionDelay = 27;
const frameTime = 1000 / 60;
const minuteTraveralTime = 58000;
const transitionClass = 'transition';

const clockHTML = `
<svg id="clock" viewBox="-1136 -1136 2272 2272" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <style type="text/css">
    #border {
      fill: white;
      stroke: lightgrey;
      stroke-width: 64;
    }

    #center {
      fill: gold;
      stroke: none;
    }

    .black {
      fill: black;
      stroke: none;
    }

    .red {
      fill: #BD2420;
      stroke: none;
    }

    .${transitionClass} {
      transition-property: transform;
      transition-duration: ${transitionDuration}ms;
      transition-delay: ${transitionDelay}ms;
      transition-timing-function: cubic-bezier(0.4, 2.08, 0.55, 0.44);
    }
  </style>
  <defs>
    <path id="mark1" d="M -40,-1000 l 80,0 0,245 -80,0 z" />
    <path id="mark2" d="M -15,-1000 l 30,0 0,80 -30,0 z" />
    <path id="handh" class="black" d="M -50,-650 l 100,0 10,890 -120,0 z" />
    <path id="handm" class="black" d="M -40,-950 l 80,0 10,1200 -100,0 z" />
    <g id="hands" class="red">
      <path d="M -20,-550 l 30,0 7,890 -30,0 z" />
      <path d="M 0,-750 a 105,105 0 0 1 0,210 a 105,105 0 0 1 0,-210 z" />
    </g>
    <g id="face1">
      <use xlink:href="#mark1" />
      <use xlink:href="#mark2" transform="rotate(06)" />
      <use xlink:href="#mark2" transform="rotate(12)" />
      <use xlink:href="#mark2" transform="rotate(18)" />
      <use xlink:href="#mark2" transform="rotate(24)" />
    </g>
    <g id="face2">
      <use xlink:href="#face1" />
      <use xlink:href="#face1" transform="rotate(30)" />
      <use xlink:href="#face1" transform="rotate(60)" />
    </g>
    <g id="face" class="black">
      <use xlink:href="#face2" />
      <use xlink:href="#face2" transform="rotate(90)" />
      <use xlink:href="#face2" transform="rotate(180)" />
      <use xlink:href="#face2" transform="rotate(270)" />
    </g>
    <g id="label" class="black">
      <path
        d="m 93.9,489 0,3.8 5,0 -5,-3.8 z m -6.7,-4.9 0,8.7 3.3,0 0,-6.2 -3.3,-2.5 z m -6.7,-4.9 0,13.7 3.3,0 0,-11.2 -3.3,-2.5 z m -6.6,-5 0,18.6 3.3,0 0,-16.1 -3.3,-2.5 z m -73.3,-3 0,21.6 c 1.2,0 2,0 3.3,-0.1 l 0,-21.7 c -1.1,0.1 -2.2,0.2 -3.3,0.2 m 6.6,-0.7 0,22 c 1.3,-0.1 1.9,-0.2 3.3,-0.4 l 0,-22.2 c -1,0.2 -2.1,0.5 -3.3,0.6 m 59.9,-1.4 0,23.6 3.4,0 0,-21.1 -3.4,-2.5 z m -53.2,-0.3 0,22.6 c 1,-0.2 2.2,-0.5 3.3,-0.8 l 0,-23.1 c -1.3,0.6 -2.1,0.9 -3.3,1.2 m 6.6,-2.8 0,23.6 c 1.1,-0.4 2.1,-0.7 3.3,-1.2 l 0,-24.4 c -1.3,0.8 -2.1,1.3 -3.3,1.9 m 39.9,-1.9 0,26.4 3.3,2.2 0,-26.1 -3.3,-2.5 z m -33.3,-2.3 0,25.2 c 1.1,-0.5 2.2,-1.1 3.3,-1.8 l 0,-26.1 c -1.3,1.2 -2.2,1.8 -3.3,2.7 m 26.6,-2.6 0,26.9 3.3,2.2 0,-26.6 -3.3,-2.5 z m -6.6,-4.9 0,27.4 3.3,2.2 0,-27.1 -3.3,-2.5 z m -10,-2 c -1.4,1.7 -1.9,2.1 -3.3,3.7 l 0,27.1 c 1.2,-1 2.2,-1.8 3.3,-2.8 l 0,-28 z m 3.3,-2.9 0,27.9 3.3,2.2 0,-27.7 -3.3,-2.5 z m -136.5,39.7 0,3.8 -5,0 5,-3.8 z m 6.7,-4.9 -0,8.7 -3.3,0 0,-6.2 3.4,-2.5 z m 6.6,-4.9 0,13.7 -3.3,0 0,-11.2 3.3,-2.5 z m 6.7,-5 -0,18.6 -3.3,0 0,-16.1 3.3,-2.5 z m 73.3,-3 0,21.6 c -1.2,0 -2,0 -3.3,-0.1 l 0,-21.7 c 1.1,0.1 2.2,0.2 3.3,0.2 m -6.6,-0.7 0,22 c -1.3,-0.1 -2,-0.2 -3.3,-0.4 l 0,-22.2 c 1,0.2 2.1,0.5 3.3,0.6 m -59.9,-1.4 -0,23.6 -3.4,0 -0,-21.1 3.4,-2.5 z m 53.2,-0.3 0,22.6 c -1,-0.2 -2.2,-0.5 -3.3,-0.8 l 0,-23.1 c 1.3,0.6 2.1,0.9 3.3,1.2 m -6.6,-2.8 0,23.6 c -1.1,-0.4 -2.1,-0.7 -3.3,-1.2 l 0,-24.4 c 1.4,0.8 2.1,1.3 3.3,1.9 m -39.9,-1.9 0,26.4 -3.3,2.2 0,-26.1 3.3,-2.5 z m 33.3,-2.3 0,25.2 c -1.1,-0.5 -2.2,-1.1 -3.3,-1.8 l 0,-26.1 c 1.3,1.2 2.1,1.8 3.3,2.7 m -26.6,-2.6 0,26.9 -3.3,2.2 0,-26.6 3.3,-2.5 z m 6.7,-4.9 -0,27.4 -3.3,2.2 0,-27.1 3.3,-2.5 z m 9.9,-2 c 1.4,1.7 1.9,2.1 3.3,3.7 l 0,27.1 c -1.2,-1 -2.2,-1.8 -3.3,-2.8 l 0,-28 z m -3.3,-2.9 0,27.9 -3.3,2.2 0,-27.7 3.3,-2.5 z m 38.6,-94.5 c 52,0 84.5,46.2 66.9,95.6 L 44.2,438 c 7.5,-28.5 -10.7,-61.1 -46.7,-60.8 -31.6,2 -50.9,28.6 -44.1,60.4 l -18.6,12 c -18.5,-46.6 13.5,-91.8 61.2,-94.8"
      />
      <path
        d="m -0.5,502.6 -5.7,0 -9,23.4 5.6,0 1.8,-3.6 9.1,0 1.8,3.5 5.4,0 -8.9,-23.4 z m -2.8,6.5 2.7,9.1 -5.3,0 2.6,-9.1 z m -36.4,-6.5 -8.4,0 0,23.4 10.2,0 c 2.6,0 5.9,-2.5 6.5,-5.7 0.1,-3.4 -1.4,-6.4 -3.9,-6.8 1.4,-0.6 2.4,-2.9 2.2,-5.9 -0.4,-3 -3.7,-5.2 -6.6,-5 m 1.6,5.7 c 0.6,1 0.2,2 -0.1,2.8 -1.1,1.2 -3,1.1 -4.5,1.1 l 0,-5.1 c 1.4,0 3.7,-0.2 4.6,1.2 m 1,8.8 c 0.6,0.9 0.5,2.7 0.2,3.3 -1.4,1.5 -3.5,1.5 -5.7,1.2 l 0,-5.5 c 2.6,-0.2 4,-0.1 5.5,1 m -71,-14.5 3.9,23.3 -4.9,0.1 -2.3,-13.6 -6.1,13.6 -1.5,-0.1 -6,-13 -2.5,13.1 -5.2,-0.1 3.8,-23.4 5.1,0 5.1,13.4 5.5,-13.3 4.9,0 z m 31.2,17.9 c -3.7,0 -6.8,-3.1 -6.8,-6.8 0,-3.7 3.1,-6.8 6.8,-6.8 3.7,0 6.8,3.1 6.8,6.8 0,3.7 -3.1,6.8 -6.8,6.8 m 0,5.5 c 6.9,0 12.6,-5.5 12.6,-12.3 0,-6.8 -5.7,-12.3 -12.6,-12.3 -6.9,0 -12.6,5.5 -12.6,12.3 0,6.8 5.7,12.3 12.6,12.3 m 104.3,-22.4 13.9,0 -0.5,2.6 -5.7,0 -3.1,19.7 -2.8,0 3.1,-19.7 -5.5,0 0.5,-2.6 z m 30.2,0 2.8,0 -3.6,22.3 -2.8,0 3.5,-22.3 z m 39.7,-1.6 1.2,23.9 -3.2,0 -0.2,-15.2 -9.6,15.7 -4.4,-15.7 -5.1,15.2 -3.2,0 8.8,-23.9 4.9,18.1 10.8,-18.1 z m 29.6,1.6 -0.7,2.6 -9.2,0 -1,6.3 9,0 -0.5,2.5 -8.9,0 -1.4,8.4 9.4,0 -0.5,2.6 -12.2,0 3.5,-22.3 12.5,0 z"
      />
    </g>
    <circle id="border" r="1104" />
    <circle id="center" r="5" />
  </defs>
  <use xlink:href="#border" />
  <use xlink:href="#label" />
  <use xlink:href="#face" />
  <use xlink:href="#handh" id="hhand" />
  <use xlink:href="#handm" id="mhand" />
  <use xlink:href="#hands" id="shand" />
  <use xlink:href="#center" />
</svg>
`.trim();

/**
 * @param {ShadowRoot} root
 * @param {LayerData} _
 * @param {[
 *  {
 *    default: typeof ui
 *  },
 *  {
 *    default: typeof import('../utils/easing.js')['default']
 *  }
 * ]} esModules
 */
const ui = (root, _, esModules) => {
  const [, { default: cubicBezier }] = esModules;
  const transition = cubicBezier(0.4, 2.08, 0.55, 0.44);

  const content = document.createRange().createContextualFragment(clockHTML);
  window.requestAnimationFrame(() => {
    root.append(content);

    const secondsHand = root.getElementById('shand');
    const minutesHand = root.getElementById('mhand');
    const hoursHand = root.getElementById('hhand');

    /**
     * @param {number} value
     * @param {HTMLElement} element
     * @param {number} base
     */
    const setHand = (value, element, base) => {
      const angle = (value / base) * 360;
      element.style.transform = `rotate(${angle}deg)`;
    };

    let oldTime = new Date(0);

    const checkTime = () => {
      const time = new Date();

      const oldMinutes = oldTime.getMinutes();
      const oldHoursRaw = oldTime.getHours();
      const oldHours = ((
        oldHoursRaw > 12 ? oldHoursRaw - 12 : oldHoursRaw) * 60
      ) + oldMinutes;

      const minutes = time.getMinutes();
      const hoursRaw = time.getHours();
      const hours = ((hoursRaw > 12 ? hoursRaw - 12 : hoursRaw) * 60) + minutes;
      const milliseconds = (time.getSeconds() * 1000) + time.getMilliseconds();

      if (
        milliseconds <= (
          transitionDuration + transitionDelay + frameTime
        )
      ) {
        secondsHand.classList.add(transitionClass);
        setHand(
          (transitionDuration + transitionDelay + frameTime),
          secondsHand,
          minuteTraveralTime
        );
      } else if (
        milliseconds <= (
          minuteTraveralTime - (
            transitionDuration + transitionDelay + frameTime
          )
        )
      ) {
        secondsHand.classList.remove(transitionClass);
        setHand(milliseconds, secondsHand, minuteTraveralTime);
      } else if (
        milliseconds <= minuteTraveralTime
      ) {
        secondsHand.classList.add(transitionClass);
        setHand(minuteTraveralTime, secondsHand, minuteTraveralTime);
      } else {
        secondsHand.classList.remove(transitionClass);
        setHand(0, secondsHand, minuteTraveralTime);
      }

      if (
        minutes === 59
        && milliseconds > (
          transitionDuration + transitionDelay + frameTime
        )
      ) {
        minutesHand.classList.remove(transitionClass);
        setHand(-1, minutesHand, 60);
      } else if (oldMinutes !== minutes) {
        minutesHand.classList.add(transitionClass);
        setHand(minutes, minutesHand, 60);
      }

      if (
        hours === 719
        && minutes === 59
        && milliseconds > (
          transitionDuration + transitionDelay + frameTime
        )
      ) {
        hoursHand.classList.remove(transitionClass);
        setHand(-1, hoursHand, 720);
      } else if (oldHours !== hours) {
        hoursHand.classList.add(transitionClass);
        setHand(hours, hoursHand, 720);
      }

      oldTime = time;

      window.requestAnimationFrame(checkTime);
    };

    checkTime();
  });
};

export default ui;
