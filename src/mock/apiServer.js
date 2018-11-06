import Express from 'express';
import bodyParser from 'body-parser';
import delay from 'express-delay';
import config from '../../config';

const PORT = config.settings.apiServer.port;
const app = new Express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(delay(config.settings.apiServer.delay));

// 以下sample ケースによって調整
app.get('/api/user', (req, res) => {
  let template = fs.readFileSync(`${config.settings.apiServer.src}sample.json`, 'utf-8');
  const id = req.query.id;
  template = template.replace(/#{id}/g, id);
  template = JSON.parse(template);
  res.json(template);
});

app.get('/api/article/:id', (req, res) => {
  const id = req.params.id;
  let t = {
    id: '#{id}',
    imgPath: '/dummy/#{id}.jpg',
  };
  t = JSON.stringify(t);
  t = t.replace(/#{id}/g, id);
  t = JSON.parse(t);
  res.json(t);
});

app.post('/api/contact/', (req, res) => {
  const err = {};
  let status = true;

  // 入力チェック

  // 名前
  if (req.body.name === undefined || req.body.name === '') {
    err.name = 'required';
    status = false;
  } else if (req.body.name.length > 100) {
    err.name = 'wordCount';
    status = false;
  }

  // メール
  if (req.body.mail === undefined || req.body.mail === '') {
    err.mail = 'required';
    status = false;
  } else if (req.body.mail.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\+\._\-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) === null) {
    err.mail = 'format';
    status = false;
  }

  // プラバシーポリシー
  if (req.body.agree === undefined || req.body.agree === 'false') {
    err.agree = 'required';
    status = false;
  }

  if (status === true) {
    res.json({ status: 0 });
  } else {
    res.json({ status: 1, err });
  }

});

export default function (callback) {
  app.listen(PORT, () => {
    console.log(`API Server is running port ${PORT}`);
    callback();
  });
}
