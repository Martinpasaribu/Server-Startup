"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sms_controllers_1 = require("../controllers/sms_controllers");
const SmsRoutes = express_1.default.Router();
SmsRoutes.post('/add-sms', sms_controllers_1.SmsControllers.AddSms);
// LeadRoutes.get('/get/lead', LeadControllers.GetLead);
exports.default = SmsRoutes;
