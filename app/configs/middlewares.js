// app/configs/middlewares.js

export const notFoundHandler = (req, res, next) => {
  if (req.method === 'GET') {
    return res.status(404).render('not-found', {
      url: req.originalUrl,
      title: 'Página no encontrada'
    });
  }

  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
    method: req.method
  });
};

export const redirectIfLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
};

export const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Debes iniciar sesión para continuar');
    return res.redirect('/sign-in');
  }
  next();
};
