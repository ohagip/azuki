import _apiServer from '../src/mock/apiServer';

export default function apiServer(callback) {
  _apiServer(() => {
    callback();
  });
}