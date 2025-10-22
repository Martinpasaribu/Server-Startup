import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import cookieParser from "cookie-parser";

// Routes
import LeadRoutes from './routes/lead_routes';
import SmsRoutes from './routes/sms_routes';
import AuthRoute from './routes/auth_routes';
import CustomerRouter from './routes/users_routes';
import CommentsRouter from './routes/comment_routes';

const app = express();

// ✅ CORS setup
app.use(cors({
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
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {

        // secure: false,
        // httpOnly: true,      
        // maxAge: 1000 * 60 * 60 * 24, // 1 hari

                
        secure: true,           // Menggunakan HTTPS wajib
        sameSite: 'none',       // Dibutuhkan untuk cookie lintas domain
        httpOnly: true,         // Melindungi dari XSS
        maxAge: 1000 * 60 * 60 * 24, // 1 hari

    },
  })
);

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  }
}

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
// ✅ JSON parser
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('trust proxy', true);


// ✅ Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Server Startup!');
});

app.use('/api/v1/lead', LeadRoutes);
app.use('/api/v1/sms', SmsRoutes);
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/customer', CustomerRouter);
app.use('/api/v1/comment', CommentsRouter);

export default app;
