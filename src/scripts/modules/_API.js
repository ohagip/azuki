/**
 * @module API
 */
import config from '../_config';

/**
 * ajax
 * @param {Object} options
 * @param {string} options.url リクエスト先のURL
 * @param {Object} options.data サーバに送信するデータ`{key: value, ...}`
 * @returns {jQuery.jqXHR.promise}
 * @private
 */
export function ajax(_options) {
  const defer = $.Deferred();
  const options = _.defaults(_options || {}, {
    type: 'POST',
    dataType: 'json',
    timeout: 10000,
  });

  $.ajax(options).then(
    (data) => {
      defer.resolve(data);
    },
    (xhr, textStatus, errorThrown) => {
      if (textStatus === 'timeout') {
        console.log('timeout error.');
      }
      defer.reject(xhr, textStatus, errorThrown);
    },
  );

  return defer.promise();
}

/*
 * 各APIは「jQuery.deferred.promise」を返す
 * 取得成功、取得失敗の処理は「promise.then」で行う
 */

/**
 * データを取得
 * @param {Object} options
 * @returns {jQuery.jqXHR.promise}
 */
export function fetchSample(options) {
  return ajax(_.defaults(options, { url: `${config.apiUrl}getSample/` }));
}

/**
 * データを登録
 * @param {Object} options
 * @returns {jQuery.jqXHR.promise}
 */
export function putSample(options) {
  return ajax(_.defaults(options, { url: `${config.apiUrl}createSample/` }));
}

/**
 * データを変更
 * @param {Object} options
 * @returns {jQuery.jqXHR.promise}
 */
export function updateSample(options) {
  return ajax(_.defaults(options, { url: `${config.apiUrl}updateSample/` }));
}

/**
 * データを削除
 * @param {Object} options
 * @returns {jQuery.jqXHR.promise}
 */
export function deleteSample(options) {
  return ajax(_.defaults(options, { url: `${config.apiUrl}deleteSample/` }));
}
