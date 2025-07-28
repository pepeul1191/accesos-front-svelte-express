import { Router } from 'express';

const router = Router();

router.get('/sign-in', (req, res) => {
  res.locals.title = 'Inicio';
  res.render('sign-in');
});

router.get('/sign-out', (req, res) => {
  res.locals.title = 'Inicio';
  res.render('sign-out');
});

export default router;
