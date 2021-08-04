import express, { json, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import db from 'quick.db';
import { join } from 'path';

const expressip = require('express-ip');

const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: '한 IP에서는 URL을 5분당 100개까지만 단축할 수 있습니다.',
});

if (!db.has('urls')) db.set('urls', {});
if (!db.has('notice')) db.set('notice', '긴 URL을 짧게 단축하세요!');

app.set('view engine', 'ejs');
app.set('views', join(__dirname, './views'));

app.use(urlencoded({ extended: true }));
app.use(json());
app.use('/shorten', limiter);
app.use(expressip().getIpInfoMiddleware);
app.use(express.static(join(__dirname, './public')));

app.get('/', (_req, res) => {
  res.render('index');
});

app.get('/shorten', (req, res) => {
  if (req.query.url === undefined)
    return res.status(400).send('단축할 URL이 제공되지 않았습니다.');

  const url = (req.query.url ?? '').toString();
  const useCustom = req.query.custom !== undefined;
  const id = useCustom
    ? (req.query.custom ?? '').toString()
    : (Object.keys(db.get('urls')).length + 1).toString();

  if (
    [
      'admin',
      'tica',
      'thoratica',
      'hayang1027',
      'hayanggames',
      'dukhwa',
      'shorten',
      'lnkk',
      'lnkkpw',
    ].includes(id) ||
    !/^[a-zA-Z0-9]+$/.test(id)
  )
    return res.status(400).send('허용되지 않는 커스텀 URL입니다.');

  if (
    !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      url
    )
  )
    return res.status(400).send('단축할 URL이 올바르지 않습니다.');

  if (useCustom && (id.length < 4 || id.length > 12))
    return res
      .status(400)
      .send('커스텀 URL은 4자 이상 12자 이하만 가능합니다.');

  // @ts-expect-error
  const ip = req.ipInfo.ip;

  if (db.has(`urls.${id}`))
    return res.status(400).send('이미 존재하는 커스텀 URL입니다.');

  const data = {
    url: url,
    id: id,
    ip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || ip,
  };

  db.set(`urls.${id}`, data);

  res.json(data);
});

app.get('/:id', (req, res) => {
  if (req.params.id === undefined) return res.redirect('/');
  const url = db.get(`urls.${req.params.id.toString()}`)?.url;
  if (url === undefined) return res.redirect('/');

  res.redirect(url);
});

app.listen(8080);

export default app;
