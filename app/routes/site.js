import { Router } from 'express';
import { requireLogin } from '../configs/middlewares.js';

const router = Router();

router.get('/', requireLogin, (req, res) => {
  res.locals.title = 'Inicio';
  res.render('index');
});

export default router;
