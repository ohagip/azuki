/**
 * analytics.js を使用してイベント トラッキングを送信する
 * （gaタグは読み込み済みとする）
 * @param {jQuery} $selector
 * @param {Object} feeds 指定したフィードを固定
 * @param {string} feeds.category
 * @param {string} feeds.action
 * @param {string} feeds.label
 * @param {number} feeds.value
 */
class TrackGA {
  constructor($selector, feeds) {
    this.$target = $($selector);
    this.feeds = feeds || {};
    this.setEvent();
  }

  /**
   * eventを設定
   */
  setEvent() {
    $(this.$target).on('click.trackGA', (e) => {
      const $target = $(e.currentTarget);
      const f = {};

      f.category = this.feeds.category || $target.attr('data-category');
      f.action = this.feeds.action || $target.attr('data-action');
      f.label = this.feeds.label || $target.attr('data-label');
      f.value = this.feeds.value || parseInt($target.attr('data-value'), 10);

      TrackGA.send(f);
    });
  }

  /**
   * eventを解除
   */
  removeEvent() {
    $(this.$target).off('click.trackGA');
  }

  /**
   * トラッキングを送信する
   * @param {Object} feeds フィード
   * @param {string} feeds.category
   * @param {string} feeds.action
   * @param {string} feeds.label
   * @param {number} feeds.value
   * @static
   */
  static send(feeds) {
    const f = feeds || {};
    const d = {};

    if (f.category !== undefined) {
      d.eventCategory = f.category;
    }
    if (f.action !== undefined) {
      d.eventAction = f.action;
    }
    if (f.label !== undefined) {
      d.eventLabel = f.label;
    }
    if (f.value !== undefined) {
      d.eventValue = f.value;
    }

    ga('send', 'event', d);
  }
}

export default TrackGA;
