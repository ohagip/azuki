/**
 *  @file サイト共通の設定
 */

const config = APP_CONFIG;

config.env = APP_ENV; // {dev, stag, prod}
config.imagesPath = `${config.assetsPath}images/`;
config.moviesPath = `${config.assetsPath}movies/`;
config.dummyImagePath = `${config.assetsPath}dummy/images/`;

export default config;
