/**
 *  @file サイト共通のスクリプト
 */

import config from './_config';
import mediaQueries from './modules/_MediaQueries';
import ShareSNS from './modules/_ShareSNS';
import { init as smInit } from './modules/_ScrollManager';
import {
  isMobile,
  isWindows,
  isMac,
  isIos,
  isAndroid,
  isIe,
  isEdge,
  isChrome,
  isSafari,
  isFirefox,
  isIe9,
  isIe10,
  isIe11,
} from './modules/_UserAgent';
import { openMenu } from './components/_menu';

$(() => {
  console.log('config', config);
  console.log(`media: current type ${mediaQueries.currentType}`);

  // OS・ブラウザ判定
  const $html = $('html');
  if (isWindows() === true) {
    $html.addClass('windows');
  }
  if (isMac() === true) {
    $html.addClass('mac');
  }
  if (isIos() === true) {
    $html.addClass('ios');
  }
  if (isAndroid() === true) {
    $html.addClass('android');
  }
  if (isChrome() === true) {
    $html.addClass('chrome');
  }
  if (isSafari() === true) {
    $html.addClass('safari');
  }
  if (isFirefox() === true) {
    $html.addClass('firefox');
  }
  if (isEdge() === true) {
    $html.addClass('edge');
  }
  if (isIe() === true) {
    $html.addClass('ie');
    if (isIe9() === true) {
      $html.addClass('ie9');
    }
    if (isIe10() === true) {
      $html.addClass('ie10');
    }
    if (isIe11() === true) {
      $html.addClass('ie11');
    }
  }

  mediaQueries.enter((currentType, prevType) => {
    switch (prevType) {
      case 'PC':
        console.log('media: exit PC');
        break;
      case 'TAB':
        console.log('media: exit TAB');
        break;
      case 'SP':
        console.log('media: exit SP');
        break;
      default:
        break;
    }

    switch (currentType) {
      case 'PC':
        console.log('media: enter PC');
        break;
      case 'TAB':
        console.log('media: enter TAB');
        break;
      case 'SP':
        console.log('media: enter SP');
        break;
      default:
        break;
    }
  });

  // シェアとスムーススクロール
  new ShareSNS();
  smInit();

  // hover系の処理をPCのみにする場合
  const isMob = isMobile();
  if (isMob === false) {
    $('.js-hover')
      .on('mouseenter', (e) => {
        $(e.currentTarget)
          .removeClass('is-leave')
          .addClass('is-over');
      })
      .on('mouseleave', (e) => {
        $(e.currentTarget)
          .removeClass('is-over')
          .addClass('is-leave');
      });
  }

  $('.p-header_menuBtn').on('click', openMenu);
});
