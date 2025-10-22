import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import user_models from "../models/user_models";
import UserModel from "../models/user_models";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/v1/auth/google/callback",
    },
async (accessToken, refreshToken, profile, done) => {
  console.log("✅ Google profile:", profile);
  console.log("✅ Access token:", accessToken ? "Ada" : "Tidak ada");
  console.log("✅ Access profile.id:", `${profile.id}`);

  try {
    let user = await UserModel.findOne({ googleId: profile.id });

    if (!user) {
      user = await UserModel.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
        avatar: profile.photos?.[0].value,
      });
    }

    return done(null, user);
  } catch (err) {
    console.error("❌ Passport error:", err);
    return done(err as Error, undefined);
  }
}

  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user || undefined);
  } catch (err) {
    done(err as Error, undefined);
  }
});

export default passport;
