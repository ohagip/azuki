/**
 * @module utils
 */

/**
 * 親要素のボックスサイズに合わせてimgもしくはvideo要素をフィットさせる
 * @param {jQuery} $parent - 親要素
 * @param {jQuery}  $children - ターゲット要素（cssでposition: absoluteの指定が必須）
 */
export function coverMedia($wrap, $target) {
  const wrapWidth = $wrap.width();
  const wrapHeight = $wrap.height();
  const wrapRatio = wrapWidth / wrapHeight; // 縦横の比率
  const targetWidth = $target.attr('width');
  const targetHeight = $target.attr('height');
  const targetRatio = targetWidth / targetHeight; // 縦横の比率
  let width;
  let height;

  // wrapとtargetの比率を見て縦横どちらを基準にフィットさせるか
  if (wrapRatio > targetRatio) {
    // 横を基準にする
    width = wrapWidth; // wrapとtargetのサイズが大きい方のwidthに合わせる
    height = width / targetRatio;
  } else {
    // 縦を基準にする
    height = wrapHeight;
    width = height * targetRatio;
  }

  // targetを縦横センタリングさせる
  const left = width > wrapWidth ? (wrapWidth - width) / 2 : 0;
  const top = height > wrapHeight ? (wrapHeight - height) / 2 : 0;

  $target.css({
    width,
    height,
    left,
    top,
  });
}

/**
 * 親要素のボックスサイズに合わせてimgもしくはvideo要素を収める
 * @param {jQuery} $parent - 親要素
 * @param {jQuery}  $children - ターゲット要素（cssでposition: absoluteの指定が必須）
 */
export function containMedia($wrap, $target) {
  const wrapWidth = $wrap.width();
  const wrapHeight = $wrap.height();
  const wrapRatio = wrapWidth / wrapHeight;
  const targetWidth = $target.attr('width');
  const targetHeight = $target.attr('height');
  const targetRatio = targetWidth / targetHeight;
  let width;
  let height;
  let left;
  let top;

  if (wrapRatio > targetRatio) {
    height = wrapHeight;
    width = height * targetRatio;
    top = 0;
    left = (wrapWidth - width) / 2;
  } else {
    width = wrapWidth;
    height = width / targetRatio;
    top = (wrapHeight - height) / 2;
    left = 0;
  }

  $target.css({
    width,
    height,
    left,
    top,
  });
}

/**
 * 親要素のボックスサイズに合わせてimgもしくはvideo要素を収めるが
 * 親要素の方が大きい場合は対象要素のもとサイズを維持したまま上下左右センターにする
 * @param {jQuery} $parent - 親要素
 * @param {jQuery}  $children - ターゲット要素（cssでposition: absoluteの指定が必須）
 */
export function containMediaMaxSize($wrap, $target) {
  const wrapWidth = $wrap.width();
  const wrapHeight = $wrap.height();
  const wrapRatio = wrapWidth / wrapHeight;
  const targetWidth = $target.attr('width');
  const targetHeight = $target.attr('height');
  const targetRatio = targetWidth / targetHeight;
  let width;
  let height;

  if (wrapRatio > targetRatio) {
    height = wrapHeight;
    if (height > targetHeight) {
      height = targetHeight;
    }
    width = height * targetRatio;
  } else {
    width = wrapWidth;
    if (width > targetWidth) {
      width = targetWidth;
    }
    height = width / targetRatio;
  }

  const left = (wrapWidth - width) / 2;
  const top = (wrapHeight - height) / 2;

  $target.css({
    width,
    height,
    left,
    top,
  });
}

/**
 * クエリストリング（URLパラメータ）をパースして返す
 * @returns {Object} `{name: value, ...}`にパースする
 */
export function getQueryString() {
  const result = {};

  if (document.location.search.length > 1) {
    const query = document.location.search.substring(1);
    const parameters = query.split('&');

    for (let i = 0, len = parameters.length; i < len; i += 1) {
      const element = parameters[i].split('=');
      const paramName = decodeURIComponent(element[0]);
      const paramValue = decodeURIComponent(element[1]);
      result[paramName] = decodeURIComponent(paramValue);
    }
  }
  return result;
}

/**
 * alignHeight
 * @param {jQuery} $target
 * @param {number} unit
 */
export function alignHeight($target, unit) {
  const u = unit || $target.length;
  const row = Math.ceil($target.length / u);
  let l;
  let i;
  let j;
  let maxHeight;
  let targetHeight;
  let $elms;
  let $elm;

  for (i = 0; i < row; i += 1) {
    $elms = $target.slice(i * u, i * u + u);
    l = $elms.length;
    j = 0;
    maxHeight = 0;

    for (; j < l; j += 1) {
      $elm = $elms.eq(j);
      targetHeight = $elm.height();
      maxHeight = maxHeight < targetHeight ? targetHeight : maxHeight;
    }
    $elms.height(maxHeight);
  }
}

/**
 * set unit
 * @param {jQuery} _target
 * @param {number} _unit - Number to divide
 * @param {Object} _options
 * @param {string} _options.selector - Target in the element a selector.
 */
export function setUnit(_target, _unit, _options) {
  let $target = $(_target);
  const length = $target.length;
  const rightNum = _unit - 1;
  const lastNum = length - 1;
  const bottomNum = (Math.ceil(length / _unit) - 1) * _unit - 1;
  const unit = _unit || length;
  const options = _options || {};

  if (options.selector !== undefined) {
    $target = $target.find(options.selector);
  }

  $target.each((i) => {
    const className = ['is-unit'];

    if (i === 0) {
      className.push('is-unit-first');
    }
    if (i === lastNum) {
      className.push('is-unit-last');
    }
    if (i < unit) {
      className.push('is-unit-top');
    }
    if (i % unit === 0) {
      className.push('is-unit-left');
    }
    if (i % unit === rightNum) {
      className.push('is-unit-right');
    }
    if (i > bottomNum) {
      className.push('is-unit-bottom');
    }

    $(this).addClass(className.join(' '));
  });
}

/**
 * destroy Unit
 * @param {jQuery} _target
 * @param {Object} _options
 * @param {string} _options.selector - Target in the element a selector.
 */
export function destroyUnit(_target, _options) {
  let $target = $(_target);
  const options = _options || {};

  if (options.selector !== undefined) {
    $target = $target.find(options.selector);
  }

  $target.removeClass('is-unit is-unit-first is-unit-last is-unit-top is-unit-bottom is-unit-left is-unit-right');
}

/**
 * random
 * @param {Number|Array} _min - arrayのときは配列内をランダムで返す
 * @param {Number} _max - ※Max未満となる
 * @return {Number}
 */
export function random(_min, _max) {
  let min = _min;
  let max = _max;
  if (min === undefined) {
    return (Math.random() + Math.random() + Math.random()) / 3;
  }

  if (max === undefined) {
    if (Array.isArray(min) === true) {
      return min[Math.floor(Math.random() * min.length)];
    }
    const r1 = Math.floor(Math.random() * min);
    const r2 = Math.floor(Math.random() * min);
    const r3 = Math.floor(Math.random() * min);
    return (r1 + r2 + r3) / 3;
  }

  if (min > max) {
    const tmp = min;
    min = max;
    max = tmp;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * CognitiveRandom
 * @param {Number} _distance - 過去のフレームと何％はなれる必要があるのか
 * @return {Number}
 */
export function CognitiveRandom(_distance) {
  const distance = _distance || 0.3;
  let lastValue = 0;
  let lastValue2 = 0;

  function r(min, max) {
    let val = Math.random();
    while (Math.abs(lastValue - val) < distance && Math.abs(lastValue2 - val) < distance) {
      val = Math.random();
    }
    lastValue2 = lastValue;
    lastValue = val;
    return val * (max - min) + min;
  }

  return r;
}

/**
 * Separate into three digits
 * @param {Number|String} v
 * @return {String}
 */
export function separate3Digits(v) {
  let r = String(v).replace(/,/g, '');
  let rPrev = r;
  let flg = false;
  for (; flg === false;) {
    r = r.replace(/^(-?\d+)(\d{3})/, '$1,$2');
    if (rPrev === r) {
      flg = true;
    }
    rPrev = r;
  }
  return r;
}

/**
 * 全角数字 → 半角数字 + 半角数字以外削除
 * @param {String} _num
 * @return {String}
 */
export function zenNum2HanNum(_num) {
  const z = ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９'];
  let num = _num;
  for (let i = 0; i < 10; i += 1) {
    num = num.replace(new RegExp(z[i], 'g'), i);
  }
  num = num.replace(new RegExp('[^0-9]', 'g'), '');
  return num;
}
