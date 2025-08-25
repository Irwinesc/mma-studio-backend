import express from 'express';
import { createSubscription, verifySubscription } from '../controller/suscriptionController.js';

const router = express.Router();

router.get('/verify-subscription/:userId', verifySubscription);
router.put('/create-subscription/:userId', createSubscription);  

export default router