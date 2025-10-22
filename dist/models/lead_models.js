"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_monggo_config_1 = require("../config/db_monggo_config");
const LeadSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    message: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const LeadModel = db_monggo_config_1.ClickUsaha.model('Lead', LeadSchema, 'Lead');
exports.default = LeadModel;
