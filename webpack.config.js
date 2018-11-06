import webpack from 'webpack';
// import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // webpack4
import config from './config';

// webpack4系を利用するとCommonsChunkPluginが利用できず
// 代替えのsplitChunksでは共通のモジュールとサイト共通の処理を同じファイルにまとめれなかった

const webpackConfig = {
  // mode: 'none', // webpack4
  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules|libs/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      // `$`,`jquery`をglobalに出す
      // {test: /jquery\.js$/, loader: 'expose-loader?$!expose-loader?jQuery'}
    ],
    // webpack4
    // rules: [
    //   { test: /\.js$/, exclude: /node_modules|libs/, use: 'babel-loader' },
    //   { test: /\.json$/, use: 'json-loader' },
    // ],
  },
  // webpack4
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /node_modules|src\/scripts\/modules|src\/scripts\/components|_config.js/,
  //         name: "common",
  //         chunks: "all",
  //         enforce: true,
  //       },
  //     },
  //   }
  // },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'app', filename: 'app.js' }),
    // new webpack.ProvidePlugin({
    //   jQuery: 'jquery',
    //   $: 'jquery',
    //   'window.jQuery': 'jquery',
    //   '_': 'lodash'
    // }),
    new webpack.DefinePlugin({
      APP_CONFIG: JSON.stringify(config.constants),
      APP_ENV: JSON.stringify(config.env),
    }),
  ],
};

if (config.settings.script.sourcemap === true) {
  webpackConfig.devtool = 'source-map';
}

if (config.settings.script.Uglify === true) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    // webpackConfig.plugins.push(new UglifyJsPlugin({ // webpack4
    uglifyOptions: {
      compress: {
        warnings: false,
      },
      mangle: {
        keep_fnames: true,
      },
    },
  }));
}

export default webpackConfig;
