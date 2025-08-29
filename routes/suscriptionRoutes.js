import express from 'express';
import { cleanExpiredSubscriptions, createSubscription, verifySubscription } from '../controller/suscriptionController.js';
import { validarToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.get('/verify-subscription/:userId', verifySubscription);
router.put('/create-subscription/:userId', createSubscription);  
router.get('/clean-subscription', validarToken, cleanExpiredSubscriptions);  

export default router