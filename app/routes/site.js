import dotenv from 'dotenv';
import { Router } from 'express';
import { requireLogin } from '../configs/middlewares.js';

const router = Router();
dotenv.config();

const sharedRoutes = [
  '/',
  '/systems',
  '/systems/:system_id/users',
  '/users'
];

sharedRoutes.forEach((path) => {
  router.get(path, requireLogin, (req, res) => {
    res.locals.title = 'Inicio';
    res.render('index', {
      API_URL: process.env.API_URL || 'http://localhost:8080/',
      BASE_URL: process.env.BASE_URL || 'http://localhost:8080/',
    });
  });
});

export default router;
