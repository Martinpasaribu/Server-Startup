import mongoose from 'mongoose';
import { ClickUsaha } from '../config/db_monggo_config';


interface ILead extends Document{
    sms: string
}

const SmsSchema = new mongoose.Schema({
    sms: { type: String, required: true },

    isDeleted: {
        type: Boolean,
        default: false  
    },
},
    {
        timestamps: true,
    }
);

const  SmsModel = ClickUsaha.model<ILead>('Sms', SmsSchema,'Sms');

export default SmsModel;
