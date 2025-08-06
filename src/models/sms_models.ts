import mongoose from 'mongoose';


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

const  SmsModel = mongoose.model<ILead>('Sms', SmsSchema,'Sms');

export default SmsModel;
