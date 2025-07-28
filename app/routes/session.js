import { Router } from 'express';
import { redirectIfLoggedIn } from '../configs/midddlewares.js'

const router = Router();

router.get('/sign-in', redirectIfLoggedIn, (req, res) => {
  res.render('sign-in', {
    error: req.flash('error'),
  });
});

router.get('/sign-out', (req, res) => {
  res.render('sign-out');
});

export default router;
