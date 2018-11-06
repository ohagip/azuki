import mediaQueries from '../modules/_MediaQueries';

/**
 * @module Menu
 */
let isInit = false;
let $menuArea = null;
let $bg = null;
let $contents = null;
let $closeBtn = null;

/**
 * init
 */
function init() {
  isInit = true;
  $menuArea = $('.p-menu');
  $bg = $('.p-menu_bg');
  $contents = $('.p-menu_contents');
  $closeBtn = $('.p-menu_closeBtn');
}

/**
 * open
 */
export function openMenu() {
  if (isInit === false) {
    init();
  }

  if (mediaQueries.currentType === 'PC') {
    TweenMax.set($bg, { opacity: 0 });
    TweenMax.set($contents, { opacity: 0, x: '-50' });
    TweenMax.set($menuArea, { opacity: 1, display: 'block' });

    TweenMax.to($bg, 0.2, { opacity: 1, ease: Power4.easeOut });
    TweenMax.to($contents, 0.4, { opacity: 1, x: '0', ease: Power4.easeOut });
  } else {
    TweenMax.set($bg, { opacity: 1 });
    TweenMax.set($contents, { opacity: 1 });
    TweenMax.set($menuArea, { opacity: 0, display: 'block' });

    TweenMax.to($menuArea, 0.2, { opacity: 1, ease: Power4.easeOut });
  }

  $bg.on('click', closeMenu);
  $closeBtn.on('click', closeMenu);
}

/**
 * close
 */
export function closeMenu() {
  TweenMax.to($menuArea, 0.2, {
    opacity: 0,
    ease: Power4.easeOut,
    onComplete: () => {
      TweenMax.set($menuArea, { display: 'none' });
    },
  });

  $bg.off('click', closeMenu);
  $closeBtn.off('click', closeMenu);
}
