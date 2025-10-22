"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const user_models_1 = __importDefault(require("../models/user_models"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://server-startup.vercel.app/api/v1/auth/google/callback" ||
        "http://localhost:5000/api/v1/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("✅ Google profile:", profile);
    console.log("✅ Access token:", accessToken ? "Ada" : "Tidak ada");
    console.log("✅ Access profile.id:", `${profile.id}`);
    try {
        let user = yield user_models_1.default.findOne({ googleId: profile.id });
        if (!user) {
            user = yield user_models_1.default.create({
                googleId: profile.id,
                name: profile.displayName,
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                avatar: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
            });
        }
        return done(null, user);
    }
    catch (err) {
        console.error("❌ Passport error:", err);
        return done(err, undefined);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_models_1.default.findById(id);
        done(null, user || undefined);
    }
    catch (err) {
        done(err, undefined);
    }
}));
exports.default = passport_1.default;
