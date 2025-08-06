
import { v4 as uuidv4 } from 'uuid'; 
import LeadModel from '../models/lead_models';
import SmsModel from '../models/sms_models';

export class SmsControllers {

        static async  AddSms  (req : any , res:any)  {

            const { sms } = req.body;

            try {

                if( !sms ){
                    return  res.status(400).json({
                        requestId: uuidv4(), 
                        message: `All Field can't be empty`,
                    })
                }
                const lead = await SmsModel.create({
                    sms: sms,
                });


                res.status(201).json(
                    {
                        requestId: uuidv4(), 
                        data: lead,
                        message: "Successfully post lead.",
                        success: true
                    }
                );

            } catch (error) {
                res.status(400).json(
                    {
                        requestId: uuidv4(), 
                        data: null,
                        message:  (error as Error).message,
                        success: false
                    }
                );
            }
        
        }

        static async  GetLead  (req : any , res:any)  {

            try {

                const users = await LeadModel.find({isDeleted:false});
                
                res.status(200).json({
                    requestId: uuidv4(),
                    data: users,
                    success: true
                });
            
            } catch (error) {

                console.log(error);
                // Kirim hasil response
                return res.status(400).json({
                requestId: uuidv4(),
                data: null,
                message: (error as Error).message || "Internal Server Error",
                success: false
                });

            }
        
        }


}