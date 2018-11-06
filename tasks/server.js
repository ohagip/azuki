import gulp from 'gulp';
import browserSync from 'browser-sync';
import proxyMiddleware from 'http-proxy-middleware';
import config from '../config';

const browser = browserSync.create();
const beforeTasks = [];

config.settings.server.middleware = [];

// API serverを使う場合、事前にAPIサーバを立てる
if (config.settings.apiServer) {
  beforeTasks.push('apiServer');
}

gulp.task('server', beforeTasks, (callback) => {
  // API serverを使う場合、/apiのリクエストをプロキシ
  if (config.settings.apiServer) {
    const apiProxy = proxyMiddleware('/api', {
      target: `http://localhost:${config.settings.apiServer.port}/`,
    });
    config.settings.server.middleware.push(apiProxy);
  }

  // postのリクエストをgetに変更（ローカルでformのmethodをPOSTのままで利用できるように）
  const post2GetProxy = (req, res, next) => {
    if (req.method === 'POST') {
      console.log(`POST to GET. ${req.url}`);
      req.method = 'GET';
    }
    next();
  };
  config.settings.server.middleware.push(post2GetProxy);
  browser.init(config.settings.server);
  callback();
});

gulp.task('server:reload', (callback) => {
  browser.reload();
  callback();
});
