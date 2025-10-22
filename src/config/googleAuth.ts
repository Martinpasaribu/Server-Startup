import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user_models";
import UserModel from "../models/user_models";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        const newUser = await UserModel.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        return done(null, newUser);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
