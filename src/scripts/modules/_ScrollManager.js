// Control of scroll（enable disable）

const $win = $(window);
let scrollEvent;
let isDisableScroll = false;

if ('onwheel' in document) {
  scrollEvent = 'wheel';
} else if ('onmousewheel' in document) {
  scrollEvent = 'mousewheel';
} else {
  scrollEvent = 'DOMMouseScroll';
}

/**
 * disable scroll
 */
export function disableScroll() {
  if (isDisableScroll === true) {
    return;
  }
  isDisableScroll = true;

  $win.on('touchmove.disableScroll', (e) => {
    e.preventDefault();
  });
  $win.on(`${scrollEvent}.disableScroll`, (e) => {
    e.preventDefault();
  });
  $win.on('keydown.disableScroll', (e) => {
    // スペース, ↑, 下
    if (e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  });
}

/**
 * enable scroll
 */
export function enableScroll() {
  if (isDisableScroll === false) {
    return;
  }
  isDisableScroll = false;

  $win.off('touchmove.disableScroll');
  $win.off(`${scrollEvent}.disableScroll`);
  $win.off('keydown.disableScroll');
}

/**
 * get state of scroll
 * @return {Boolean}
 */
export function getStateOfScroll() {
  return isDisableScroll;
}

/**
 * 指定位置までスクロースさせる
 * @param {Number} position - スクロール位置
 */
export function scrollTo(position) {
  const scrollTop = $(window).scrollTop();
  let time = Math.abs(scrollTop - position) * 0.7;
  if (time <= 600) {
    time = 600;
  }
  if (time >= 1300) {
    time = 1300;
  }
  time /= 1000;

  TweenMax.to($('body, html'), time, {
    ease: Power4.easeOut,
    scrollTop: position,
  });
}

/**
 * ↑のハンドラ
 */
export function scrollToHandler() {
  const $target = $(this);
  const marker = $target.attr('data-scroll-target');
  const $marker = marker === '#' ? null : $(marker);
  let position = marker === '#' ? 0 : $marker.offset().top;
  let offset1 = 0;
  let offset2 = 0;

  $($target.attr('data-scroll-offset-target')).each(() => {
    offset1 += $(this).height();
  });

  if ($target.attr('data-scroll-offset') !== undefined) {
    offset2 = parseInt($target.attr('data-scroll-offset'), 10);
  }

  if ($target.attr('data-scroll-target-bottom') !== undefined) {
    position += $marker.outerHeight();
  }

  position = position - offset1 - offset2;
  scrollTo(position);
}

/**
 * init
 */
export function init() {
  $('.js-scroll').on('click', scrollToHandler);
}
