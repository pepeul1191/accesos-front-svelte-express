import { Router } from 'express';

const router = Router();

router.get('/sign-in', (req, res) => {
  res.locals.title = 'Inicio';
  res.render('sign-in');
});

export default router;
