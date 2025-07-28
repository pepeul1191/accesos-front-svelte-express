import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.locals.title = 'Inicio';
  res.render('index');
});

export default router;
