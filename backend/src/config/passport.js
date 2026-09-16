import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({username: username.toLowerCase()});
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return done(null, false, {message: "Invalid username or password"});
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select("_id username");
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});

export default passport;
