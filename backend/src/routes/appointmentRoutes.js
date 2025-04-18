import { Router } from 'express';
import { 
  getAppointments, 
  createAppointment, 
  deleteAppointment, 
  getAvailableAppointments, 
  updateAppointment
} from '../controllers/appointmentController.js'

const router = Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment); 
router.delete('/:id', deleteAppointment);
router.get('/available', getAvailableAppointments);

export default router;