"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SmsSchema = new mongoose_1.default.Schema({
    sms: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const SmsModel = mongoose_1.default.model('Sms', SmsSchema, 'Sms');
exports.default = SmsModel;
