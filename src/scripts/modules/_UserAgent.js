/**
 * @module UserAgent
 */

const ua = navigator.userAgent.toLowerCase();

/**
 * IE判定
 * @returns {boolean}
 */
export function isIe() {
  return ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1;
}

/**
 * IE6判定
 * @returns {boolean}
 */
export function isIe6() {
  return ua.indexOf('msie 6.') !== -1;
}

/**
 * IE7判定
 * @returns {boolean}
 */
export function isIe7() {
  return ua.indexOf('msie 7.') !== -1;
}

/**
 * IE8判定
 * @returns {boolean}
 */
export function isIe8() {
  return ua.indexOf('msie 8.') !== -1;
}

/**
 * IE9判定
 * @returns {boolean}
 */
export function isIe9() {
  return ua.indexOf('msie 9.') !== -1;
}

/**
 * IE10判定
 * @returns {boolean}
 */
export function isIe10() {
  return ua.indexOf('msie 10.') !== -1;
}

/**
 * IE11判定
 * @returns {boolean}
 */
export function isIe11() {
  return ua.indexOf('trident/7') !== -1;
}

/**
 * IE6,7,8,9,10判定
 * @returns {boolean}
 */
export function isOldIe() {
  return isIe10() || isIe9() || isIe8() || isIe7() || isIe6();
}

/**
 * Edge判定
 * @returns {boolean}
 */
export function isEdge() {
  return ua.indexOf('edge') !== -1;
}

/**
 * Chrome判定
 * @returns {boolean}
 */
export function isChrome() {
  return ua.indexOf('chrome') !== -1 && ua.indexOf('edge') === -1;
}

/**
 * Safari判定
 * @returns {boolean}
 */
export function isSafari() {
  return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
}

/**
 * Firefox判定
 * @returns {boolean}
 */
export function isFirefox() {
  return ua.indexOf('firefox') !== -1;
}

/**
 * Opera判定
 * @returns {boolean}
 */
export function isOpera() {
  return ua.indexOf('opera') !== -1;
}

/**
 * iPhone判定
 * @returns {boolean}
 */
export function isIphone() {
  return ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1;
}

/**
 * Android SP判定
 * @returns {boolean}
 */
export function isAndroidSp() {
  return ua.indexOf('android') !== -1 && ua.indexOf('mobile') !== -1;
}

/**
 * SP判定
 * @returns {boolean}
 */
export function isSp() {
  return isAndroidSp() || isIphone();
}

/**
 * iPad判定
 * @returns {boolean}
 */
export function isIpad() {
  return ua.indexOf('ipad') !== -1;
}

/**
 * Android Tablet判定
 * @returns {boolean}
 */
export function isAndroidTab() {
  return ua.indexOf('android') !== -1 && !isAndroidSp();
}

/**
 * Tablet判定
 * @returns {boolean}
 */
export function isTablet() {
  return isIpad() || isAndroidTab();
}

/**
 * SP, tablet判定
 * @returns {boolean}
 */
export function isMobile() {
  return isSp() || isTablet();
}

/**
 * Windows判定
 * @returns {boolean}
 */
export function isWindows() {
  return ua.indexOf('windows') !== -1 && ua.indexOf('phone') === -1;
}

/**
 * Windows判定のバージョンを返す
 * @returns {String} 取得できない場合は空文字
 */
export function getWindowsVersion() {
  if (/windows/.test(ua) === true) {
    const v = ua.match(/windows nt (\d+\.\d+)/) || [];
    let version = '';
    switch (v[1]) {
      case '5.1':
      case '5.2':
        version = 'XP';
        break;
      case '6.0':
        version = 'Vista';
        break;
      case '6.1':
        version = '7';
        break;
      case '6.2':
        version = '8';
        break;
      case '6.3':
        version = '8.1';
        break;
      case '10.0':
        version = '10';
        break;
    }
    return version;
  }
  return '';
}

/**
 * Mac判定
 * @returns {boolean}
 */
export function isMac() {
  return ua.indexOf('mac') !== -1 && ua.indexOf('os') !== -1;
}

/**
 * iOS判定
 * @returns {boolean}
 */
export function isIos() {
  return isIphone() || isIpad();
}

/**
 * Android判定
 * @returns {boolean}
 */
export function isAndroid() {
  return ua.indexOf('android') !== -1;
}

/**
 * iOSのバージョンを返す
 * @returns {Array} [major, Minor, build]（取得出来ない場合は`0`とする）
 */
export function getIOSVersion() {
  if (/ip(hone|od|ad)/.test(ua) === true) {
    const v = ua.match(/os (\d+)_(\d+)_?(\d+)?/) || [];
    const versions = [parseInt(v[1] || 0, 10), parseInt(v[2] || 0, 10), parseInt(v[3] || 0, 10)];
    return versions;
  }
  return [0, 0, 0];
}

/**
 * Androidのバージョンを返す
 * @returns {Array} [major, Minor, build]（取得出来ない場合は`0`とする）
 */
export function getAndroidVersion() {
  if (/android/.test(ua) === true) {
    const v = ua.match(/android (\d+).(\d+).?(\d+)?/) || [];
    const versions = [parseInt(v[1] || 0, 10), parseInt(v[2] || 0, 10), parseInt(v[3] || 0, 10)];
    return versions;
  }
  return [0, 0, 0];
}
