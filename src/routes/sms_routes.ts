import express from 'express';
import { SmsControllers } from '../controllers/sms_controllers';


const SmsRoutes: express.Router = express.Router();


SmsRoutes.post('/add-sms', SmsControllers.AddSms );
// LeadRoutes.get('/get/lead', LeadControllers.GetLead);

export default SmsRoutes;
