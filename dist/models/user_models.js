"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const db_monggo_config_1 = require("../config/db_monggo_config");
const userSchema = new mongoose_1.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    refreshToken: { type: String, default: null },
}, { timestamps: true });
const UserModel = db_monggo_config_1.Nest_Js.model("User", userSchema);
exports.default = UserModel;
