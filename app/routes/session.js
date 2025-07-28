import dotenv from 'dotenv';
import { Router } from 'express';
import axios from 'axios';
import { redirectIfLoggedIn } from '../configs/middlewares.js';

const router = Router();
dotenv.config();

router.get('/sign-in', redirectIfLoggedIn, (req, res) => {
  res.render('sign-in', {
    error: req.flash('error'),
  });
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar credenciales contra variables de entorno
    if (username !== process.env.ADMIN_USERNAME || 
        password !== process.env.ADMIN_PASSWORD) {
      req.flash('error', 'Nombre de usuario o contraseña incorrectos');
      return res.redirect('/sign-in');
    }

    // Hacer petición a la API para generar el JWT
    const apiResponse = await axios.post(
      process.env.API_URL + 'api/v1/sign-in/admin',
      {}, // body vacío ya que no se necesita payload
      {
        headers: {
          'X-Auth-Admin-Trigger': process.env.AUTH_ADMIN_HEADER,
          'Content-Type': 'application/json'
        }
      }
    );

    // Guardar datos en sesión (debe ser después de obtener el token)
    req.session.user = {
      username: username,
      token: apiResponse.data, // response token
      loginTime: new Date(),
      role: 'admin'
    };

    // Redirigir al dashboard o página principal
    res.redirect('/'); // o donde quieras redirigir después del login

  } catch (error) {
    console.error('Error en el proceso de login:', error);
    
    let errorMessage = 'Ocurrió un error durante el proceso de autenticación';
    
    if (error.response) {
      // Error de la API externa
      errorMessage = error.response.data.message || 'Error al generar el token';
    } else if (error.request) {
      // Error de conexión
      errorMessage = 'No se pudo conectar con el servicio de autenticación';
    }
    
    req.flash('error', errorMessage);
    res.redirect('/sign-in');
  }
});

router.get('/sign-out', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/sign-in');
  });
});

// Ruta para obtener los datos de la sesión
router.get('/session', (req, res) => {
  // Verificar si existe una sesión activa
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user,
      sessionId: req.sessionID,
      createdAt: req.session.cookie.expires
    });
  } else {
    res.json({
      authenticated: false,
      message: 'No hay sesión activa'
    });
  }
});

export default router;