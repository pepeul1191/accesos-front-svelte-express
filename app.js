import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import { notFoundHandler, errorHandler } from './app/configs/midddlewares.js'

import sessionRouter from './app/routes/session.js';
import siteRouter from './app/routes/site.js';

const app = express();

// 🧠 Equivalente a __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', sessionRouter);
app.use('/', siteRouter);

// catch 404 and forward to error handler
app.use(notFoundHandler);
//app.use(errorHandler);

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
