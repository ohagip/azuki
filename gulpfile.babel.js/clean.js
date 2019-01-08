import deleteEmpty from 'delete-empty';
import del from 'del';
import config from '../config';

export function clean(callback) {
  del.sync(config.settings.clean.patterns, config.settings.clean.options);
  deleteEmpty.sync(config.settings.cleanDirectory.path);
  callback();
}

export function cleanDoc(callback) {
  del.sync(config.settings.cleanDoc.patterns, config.settings.cleanDoc.options);
  callback();
}