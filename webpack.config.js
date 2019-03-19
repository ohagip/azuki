import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import config from './config';

const webpackConfig = {
  mode: 'none',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules|libs/, use: 'babel-loader' },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.(glsl|vs|fs|vert|frag)$/, exclude: /node_modules/, use: ['glslify-import-loader', 'raw-loader', 'glslify-loader'] },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules|src\/scripts\/modules|src\/scripts\/components|_config.js/,
          name: 'common',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
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
  webpackConfig.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false,
      },
      // mangle: {
      //   keep_fnames: true,
      // },
    },
  }));
}

export default webpackConfig;
