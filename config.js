import _ from 'lodash';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const ROOT = __dirname;
const ENV = argv.env || 'dev';

// コンテンツパスを変更した場合、styleguideジェネレータ設定ファイルの変更が必要
// （'/src/styleguide/aigis_config.yml > `- ../../dist/${CONTENTS_PATH}assets`'）
const CONTENTS_PATH = ''; // dist先ディレクトリを調整する（例: 'sample/'）

const SRC = `${ROOT}/src/`;
const DEST = `${ROOT}/dist/${CONTENTS_PATH}`;
const SERVER_DIR = `${ROOT}/dist/`;

const paths = {
  src: `${SRC}`,
  dist: `${DEST}`,
  view: {
    src: `${SRC}views/pages/**/!(_)*.ejs`,
    dir: `${SRC}views/`,
    watch: `${SRC}views/**/*.ejs`,
    dist: `${DEST}`,
  },
  style: {
    src: `${SRC}styles/**/!(_)*.scss`,
    dir: `${SRC}styles/`,
    watch: `${SRC}styles/**/*.scss`,
    dist: `${DEST}assets/css/`,
  },
  styleguide: {
    dir: `${SRC}styleguide/`,
    dist: `${ROOT}/doc/styleguide/`,
  },
  script: {
    src: `${SRC}scripts/**/!(_)*.js`,
    prettierSrc: [`${SRC}scripts/**/*.js`, `!${SRC}scripts/libs/**/*.js`],
    dir: `${SRC}scripts/`,
    watch: `${SRC}scripts/**/*.js`,
    dist: `${DEST}assets/js/`,
    // headタグで読み込みscripts（※更新時は再度ビルドが必要）
    libsHead: [],
    // 通常のbodyタグ末尾で読み込みscripts（※更新時は再度ビルドが必要）
    libs: [
      `${ROOT}/node_modules/jquery/dist/jquery.min.js`,
      `${ROOT}/node_modules/lodash/lodash.min.js`,
      `${ROOT}/node_modules/gsap/src/minified/TweenMax.min.js`,
      // `${ROOT}/node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js`,
      // `${ROOT}/node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js`,
      // `${ROOT}/node_modules/scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js`,
      `${ROOT}/node_modules/imagesloaded/imagesloaded.pkgd.min.js`,
      // `${ROOT}/node_modules/slick-carousel/slick/slick.min.js`,
      // `${SRC}scripts/libs/_iscroll.min.js`,
    ],
  },
  jsdoc: {
    src: `${SRC}scripts/*`,
    dist: `${ROOT}/doc/jsdoc/`,
  },
  image: {
    src: `${SRC}images/**/*`,
    dir: `${SRC}images/`,
    watch: `${SRC}images/**/*`,
    dist: `${DEST}assets/images/`,
  },
  iconFont: {
    src: `${SRC}iconFont/*.svg`,
    dir: `${SRC}iconFont/`,
    watch: `${SRC}iconFont/*.svg`,
    dist: `${DEST}assets/font/`,
  },
  svgSprite: {
    src: `${SRC}svgSprite/*.svg`,
    dir: `${SRC}svgSprite/`,
    watch: `${SRC}svgSprite/**/*`,
    dist: `${DEST}assets/images/common/svgSprite.svg`,
  },
  static: {
    // font, htaccessなど
    src: [`${SRC}static/**/*`, `!${SRC}static/**/.gitkeep`],
    dir: `${SRC}static/`,
    watch: `${SRC}static/**/*`,
    dist: `${DEST}`,
  },
};

const constants = {
  default: {
    url: '/',
    apiUrl: '/',
    contentsPath: `/${CONTENTS_PATH}`,
    assetsPath: `/${CONTENTS_PATH}assets/`,
    gaID: '',
    ogpAppID: '',
    mqBreakpoint: [
      { type: 'SP', min: undefined, max: 767 },
      { type: 'TAB', min: 768, max: 1023 },
      { type: 'PC', min: 1024, max: undefined },
    ],
  },
  dev: {
    url: 'http://localhost:3000/',
    apiUrl: '/api/',
    contentsPath: `/${CONTENTS_PATH}`,
    assetsPath: `/${CONTENTS_PATH}assets/`,
    gaID: '',
    ogpAppID: '',
  },
  stag: {
    url: 'http://staging.example.com/',
    apiUrl: '/api/',
    contentsPath: `/${CONTENTS_PATH}`,
    assetsPath: `/${CONTENTS_PATH}assets/`,
    gaID: '',
    ogpAppID: '',
  },
  prod: {
    url: 'http://example.com/',
    apiUrl: '/api/',
    contentsPath: `/${CONTENTS_PATH}`,
    assetsPath: `/${CONTENTS_PATH}assets/`,
    gaID: '',
    ogpAppID: '',
  },
};

const settings = {
  default: {
    view: {
      changed: false,
      minify: false,
    },
    style: {
      changed: false,
      minify: false,
      sourcemap: true,
    },
    script: {
      changed: false,
      Uglify: false,
      sourcemap: true,
    },
    image: {
      minify: false,
    },
    svgSprite: {
      isUse: false,
      // isUse: true, // 利用する場合 src/styles/app.scss > `@import 'object/component/_svgSprite';`の追加が必要
      options: {
        cssPathSvg: 'common/svgSprite.svg', // SCSSテンプレートの中で利用する値
        padding: 0, // ガター（スプライト同士の余白）
        pixelBase: 100, // 個別の SVG アイコン作成時に統一した高さ。
        positioning: 'packed', // スプライトの配置設定
        templateSrc: `${paths.svgSprite.dir}_template.scss`, // 用意したSCSSテンプレート
        templateDest: `${paths.style.dir}object/component/_svgSprite.scss`, // テンプレートから生成されるSCSSファイル
        units: 'em',
      },
    },
    minifier: {
      removeComments: true,
      collapseWhitespace: true,
    },
    ejs: {
      options: {},
      settings: {
        ext: '.html',
      },
    },
    autoprefixer: {
      browsers: ['last 2 versions', 'ie >= 9', 'ios >= 7', 'android >= 4.0'],
    },
    cssMqpacker: {},
    sass: {
      options: {
        outputStyle: 'expanded',
      },
    },
    clean: {
      patterns: [`${DEST}**/*`],
      options: {},
    },
    cleanDirectory: {
      path: `${DEST}`,
    },
    cleanDoc: {
      patterns: [`${ROOT}/docs/**/*`],
      options: {},
    },
    server: {
      port: 3000,
      server: {
        baseDir: `${SERVER_DIR}`,
        index: 'index.html',
      },
      ui: {
        port: 3001,
      },
      serveStatic: [
        {
          route: '/dummy',
          dir: `${SRC}mock/assets/`,
        },
        {
          route: '/doc',
          dir: `${ROOT}/doc/`,
        },
      ],
      ghostMode: false,
      reloadDebounce: 500,
    },
    // api mock 利用しない場合はコメントアウト
    apiServer: {
      port: 8888,
      delay: 500,
      src: `${SRC}mock/apiTemplate/`,
    },
    htmlhint: '.htmlhintrc',
    sassLint: {},
    eslint: {
      useEslintrc: true,
    },
    styleguide: {},
    jsdoc: {
      tags: {
        allowUnknownTags: true,
      },
      opts: {
        destination: paths.jsdoc.dist,
      },
      plugins: ['plugins/markdown'],
      templates: {
        cleverLinks: false,
        monospaceLinks: false,
        default: {
          outputSourceFiles: true,
        },
        path: 'ink-docstrap',
        theme: 'Cyborg',
        navType: 'vertical',
        linenums: true,
        dateFormat: 'MMMM Do YYYY, h:mm:ss a',
      },
    },
  },
  dev: {},
  stag: {
    style: {
      minify: true,
      sourcemap: false,
    },
    script: {
      Uglify: true,
      sourcemap: false,
    },
    image: {
      minify: false,
    },
  },
  prod: {
    style: {
      minify: true,
      sourcemap: false,
    },
    script: {
      Uglify: true,
      sourcemap: false,
    },
    image: {
      minify: false,
    },
  },
};

const config = {
  env: ENV,
  paths,
  constants: _.merge({}, constants.default, constants[ENV]),
  settings: _.merge({}, settings.default, settings[ENV]),
  isWatch: false,
};

export default config;
