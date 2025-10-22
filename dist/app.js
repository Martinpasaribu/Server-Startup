"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Routes
const lead_routes_1 = __importDefault(require("./routes/lead_routes"));
const sms_routes_1 = __importDefault(require("./routes/sms_routes"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const users_routes_1 = __importDefault(require("./routes/users_routes"));
const comment_routes_1 = __importDefault(require("./routes/comment_routes"));
const app = (0, express_1.default)();
// ✅ CORS setup
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://savoy-client.vercel.app",
        "https://www.clickusaha.com",
        "https://clickusaha.com"
    ],
    methods: ["POST", "GET", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ✅ Session middleware (HARUS sebelum passport)
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // secure: false,
        // httpOnly: true,      
        // maxAge: 1000 * 60 * 60 * 24, // 1 hari
        secure: true, // Menggunakan HTTPS wajib
        sameSite: 'none', // Dibutuhkan untuk cookie lintas domain
        httpOnly: true, // Melindungi dari XSS
        maxAge: 1000 * 60 * 60 * 24, // 1 hari
    },
}));
// ✅ Passport setup
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
// ✅ JSON parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.set('trust proxy', true);
// ✅ Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Server Startup!');
});
app.use('/api/v1/lead', lead_routes_1.default);
app.use('/api/v1/sms', sms_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/customer', users_routes_1.default);
app.use('/api/v1/comment', comment_routes_1.default);
exports.default = app;
