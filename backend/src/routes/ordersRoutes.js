import Router from 'express';
import { getOrders, createOrder } from '../controllers/ordersController.js';
const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);

export default router;