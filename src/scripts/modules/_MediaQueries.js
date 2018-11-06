import EventEmitter from 'events';
import config from '../_config';

/**
 * 画面幅のブレイクポイントでイベントを発火する
 * @extends EventEmitter
 */
class MediaQueries extends EventEmitter {
  /**
   * 初期化
   * @constructor
   */
  constructor() {
    super();

    /**
     * breakpoint list [{ type: 'SP', min: undefined, max: 768 },...]
     * @type {Array}
     */
    this.breakpoinList = config.mqBreakpoint;

    /**
     * ↑length
     * @type {Number}
     */
    this.breakpoinLength = this.breakpoinList.length;

    /**
     * prevType previous media type（PC, TAB, SPなど）
     * @type {null|string}
     */
    this.prevType = null;

    /**
     * current media type（PC, TAB, SPなど）
     * @type {null|string}
     */
    this.currentType = null;

    this.checkMediaType = this.checkMediaType.bind(this);
    this.checkMediaType();
    $(window).on('resize.MediaQueries', _.debounce(this.checkMediaType, 100));
  }

  enter(callback) {
    if (this.currentType !== null) {
      callback(this.currentType, this.prevType);
    }
    this.on('change', callback);
  }

  exit(callback) {
    this.removeListener('change', callback);
  }

  /**
   * 画面幅に応じたメディアを確認する
   * @callback
   * @private
   */
  checkMediaType() {
    const windowWidth = window.innerWidth;
    let type = null;

    for (let i = 0, l = this.breakpoinLength; i < l; i += 1) {
      const b = this.breakpoinList[i];
      if (b.min !== undefined || b.max !== undefined) {
        if (b.min === undefined && windowWidth <= b.max) {
          type = b.type;
          break;
        }
        if (b.max === undefined && windowWidth >= b.min) {
          type = b.type;
          break;
        }
        if (windowWidth >= b.min && windowWidth <= b.max) {
          type = b.type;
          break;
        }
      }
    }

    if (type !== null) {
      this.setDevice(type);
    }
  }

  /**
   * メディアを設定（設定値が変わった場合のみイベントを発火する）
   * @param {string} type
   * @private
   */
  setDevice(type) {
    if (type !== this.currentType) {
      this.prevType = this.currentType;
      this.currentType = type;
      this.emit('change', this.currentType, this.prevType);
    }
  }
}

/* サイト内で1インスタンスで取り回すので事前にインスタンスを作成 */
const instance = new MediaQueries();

export default instance;
