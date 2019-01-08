/**
 *  @file indexページのスクリプト
 */

import mediaQueries from './modules/_MediaQueries';
import { alignHeight } from './modules/_utils';
import YTPlayer from './modules/_YTPlayer';
import Slider from './modules/_CustomSlider';

function alignCardHeight() {
  const $card = $('.c-card_text');
  $card.height('');
  alignHeight($card, 3);
}

const debouncedAlignCardHeight = _.debounce(alignCardHeight, 100);

function enterPC() {
  alignCardHeight();
}

function exitPC() {}

function enterSP() {
  alignCardHeight();
  $(window).on('resize.alignCardHeight', debouncedAlignCardHeight);
}

function exitSP() {
  debouncedAlignCardHeight.cancel();
  $(window).off('resize.alignCardHeight');
}

$(() => {
  // YouTube埋め込み[オプション](https://developers.google.com/youtube/player_parameters?hl=ja)
  const ytOptions = {
    rel: 0, // 関連動画を表示させない
    showinfo: 0, // 動画の再生が始まる前に動画のタイトルなど情報を表示させない
    controls: 0, // プレーヤー コントロールを表示させない
    loop: 1, // 動画を繰り返し表示
  };

  const ytPlayer = new YTPlayer('youtube', 'q6T0wOMsNrI', 1280, 720, ytOptions);
  console.log('ytPlayer', ytPlayer);

  // ヒーローエリア スライダー
  const heroSlider = new Slider(
    $('.hero'),
    [
      { time: 4, enter: () => {}, exit: () => {} },
      { time: 4, enter: () => {}, exit: () => {} },
      { time: 4, enter: () => {}, exit: () => {} },
      { time: 4, enter: () => {}, exit: () => {} },
    ],
    'hero',
    1
  );

  $('.hero_item > img').imagesLoaded(() => {
    heroSlider.start();
  });

  mediaQueries.enter((currentType, prevType) => {
    switch (prevType) {
      case 'PC':
        exitPC();
        break;
      case 'SP':
        exitSP();
        break;
      default:
        break;
    }

    switch (currentType) {
      case 'PC':
        enterPC();
        break;
      case 'SP':
        enterSP();
        break;
      default:
        break;
    }
  });
});
