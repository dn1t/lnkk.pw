import express, { json, urlencoded } from 'express';
import db from 'quick.db';
import { join } from 'path';

const app = express();

if (!db.has('urls')) db.set('urls', []);
if (!db.has('notice')) db.set('notice', '긴 URL을 짧게 단축하세요!');

app.set('view engine', 'ejs');
app.set('views', join(__dirname, './views'));

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static(join(__dirname, './public')));

app.get('/', (_req, res) => {
  res.render('index');
});

app.listen(3000);

export default app;
