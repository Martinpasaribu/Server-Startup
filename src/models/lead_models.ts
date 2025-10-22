import mongoose from 'mongoose';
import { ClickUsaha } from '../config/db_monggo_config';


interface ILead extends Document{
    name: string,
    email: string,
    phone: number,
    message: string,
}

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    message: { type: String, required: true },

    isDeleted: {
        type: Boolean,
        default: false  
    },
},
    {
        timestamps: true,
    }
);

const  LeadModel = ClickUsaha.model<ILead>('Lead', LeadSchema,'Lead');

export default LeadModel;
