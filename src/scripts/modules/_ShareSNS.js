/**
 * snsシェアを行う（各シェア用のwindowを開く）
 */

const isLineScriptLoaded = false;

class ShareSNS {
  /**
   * 対象となるボタンのセレクタを設定
   * デフォルト: `.js-shareSNS-tw`, `.js-shareSNS-fb`, `.js-shareSNS-go`, `.js-shareSNS-ha`
   * ボタンのdata属性に`data-url`, `data-text`, `data-hash`の設定が必要
   * LINEは任意のボタンを作成できない[設置方法](https://media.line.me/ja/how_to_install)
   * @param {Object|Undefined} options 今後他のSNS, オプション設けるかも
   * @param {jQuery|String} options.$twitter jQuery object or selector
   * @param {jQuery|String} options.$facebook jQuery object or selector
   * @param {jQuery|String} options.$google jQuery object or selector
   */
  constructor(options) {
    this.options = options || {};
    this.options.twitter = this.options.twitter || '.js-shareSNS-twitter';
    this.options.twitterF = this.options.twitterF || '.js-shareSNS-twitterFollow';
    this.options.facebook = this.options.facebook || '.js-shareSNS-facebook';
    this.options.google = this.options.google || '.js-shareSNS-google';
    this.options.hatena = this.options.hatena || '.js-shareSNS-hatena';
    this.options.line = this.options.line || '.js-shareSNS-line';
    this.setEvent();
  }

  /**
   * eventを設定
   */
  setEvent() {
    this.$twitter = $(this.options.twitter);
    $(this.$twitter).on('click.shareSNS', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const url = $target.attr('data-url');
      const text = $target.attr('data-text');
      const hash = $target.attr('data-hash');
      ShareSNS.twitter(url, text, hash);
    });
    this.$twitterF = $(this.options.twitterF);
    $(this.$twitterF).on('click.shareSNS', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const name = $target.attr('data-name');
      ShareSNS.twitterFollow(name);
    });

    this.$facebook = $(this.options.facebook);
    $(this.$facebook).on('click.shareSNS', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const url = $target.attr('data-url');
      ShareSNS.facebook(url);
    });

    this.$google = $(this.options.google);
    $(this.$google).on('click.shareSNS', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const url = $target.attr('data-url');
      ShareSNS.google(url);
    });

    this.$hatena = $(this.options.hatena);
    $(this.$hatena).on('click.shareSNS', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const url = $target.attr('data-url');
      ShareSNS.hatena(url);
    });

    // this.$line = $(this.options.line);
    // $(this.$line).each((i, e) => {
    //   const $target = $(e);
    //   const url = $target.attr('data-url');
    //   ShareSNS.line($target, url);
    // });

    this.$line = $(this.options.line);
    $(this.$line).on('click.shareSNS', (e) => {
      e.preventDefault();
      const $target = $(e.currentTarget);
      const url = $target.attr('data-url');
      ShareSNS.line(url);
    });
  }

  /**
   * eventを解除
   */
  removeEvent() {
    $(this.$twitter).off('click.shareSNS');
    $(this.$twitterF).off('click.shareSNS');
    $(this.$facebook).off('click.shareSNS');
    $(this.$google).off('click.shareSNS');
    $(this.$hatena).off('click.shareSNS');
    $(this.$line).html('');
  }

  /**
   * Twitterでシェアする
   * @param {string} url シェアURL
   * @param {string} text シェアテキスト
   * @param {string} hash  シェアのハッシュ
   */
  static twitter(url, text, hash) {
    const shareText = encodeURIComponent(text);
    const shareHash = encodeURIComponent(hash);
    const shareUrl = `http://twitter.com/share?url=${url}&text=${shareText}&hashtags=${shareHash}`;
    this.openWindow(shareUrl, 500, 355);
  }

  /**
   * Twitterでフォロー
   * @param {string} name シェアテキスト
   */
  static twitterFollow(name) {
    const shareUrl = `https://twitter.com/intent/follow?screen_name=${name}`;
    this.openWindow(shareUrl, 500, 500);
  }

  /**
   * Facebookでシェアする
   * @param {string} url シェアURL
   */
  static facebook(url) {
    const shareUrl = `http://www.facebook.com/sharer.php?u=${url}`;
    this.openWindow(shareUrl, 560, 715);
  }

  /**
   * Googleでシェアする
   * @param {string} url シェアURL
   */
  static google(url) {
    const shareUrl = `https://plus.google.com/share?url=' + ${url}`;
    this.openWindow(shareUrl, 600, 600);
  }

  /**
   * Hatenaでシェアする
   * @param {string} url シェアURL
   */
  static hatena(url) {
    const shareUrl = `http://b.hatena.ne.jp/entry/${url}`;
    window.open(shareUrl, '_blank');
  }

  /**
   * LINEでシェアする
   * @param {jQuery} $target ボタンに設定するDOM
   * @param {string} url シェアURL
   */
  // static line($target, url) {
  //   $target.html(`<div class="line-it-button" data-lang="ja" data-type="share-d" data-url="${url}" style="display: none;"></div>`);
  //   if (isLineScriptLoaded === true) {
  //     LineIt.loadButton();
  //   } else {
  //     $.getScript('https://d.line-scdn.net/r/web/social-plugin/js/thirdparty/loader.min.js', () => {
  //       LineIt.loadButton();
  //       isLineScriptLoaded = true;
  //     });
  //   }
  // }

  /**
   * LINEでシェアする
   * @param {string} url シェアURL
   */
  static line(url) {
    const shareUrl = `https://timeline.line.me/social-plugin/share?url=${url}`;
    this.openWindow(shareUrl, 510, 510);
  }

  /**
   * windowを開く
   * @param {string} url windowのURL
   * @param {number} width windowの幅
   * @param {number} height windowの高さ
   */
  static openWindow(url, width, height) {
    const w = width || 600;
    const h = height || 400;
    const l = window.screen.width / 2 - w / 2;
    const t = window.screen.height / 2 - h / 2;
    window.open(url, 'sharewindow', `scrollbars=yes, width=${w}, height=${h}, left=${l}, top=${t}`);
  }
}

export default ShareSNS;
