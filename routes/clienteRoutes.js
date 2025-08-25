import express from 'express';
import { datosCliente, logIn, register } from '../controller/clienteController.js';
import { validarToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', logIn);
router.get('/:id', validarToken, datosCliente)

export default router