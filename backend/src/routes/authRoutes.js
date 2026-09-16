import {Router} from "express";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import User from "../models/User.js";

const router = Router();

const publicUser = (user) => ({id: user._id, username: user.username});

router.post("/register", async (req, res) => {
    try {
        const username = req.body.username?.trim().toLowerCase();
        const password = req.body.password;

        if (!username || !password || password.length < 6) {
            return res.status(400).json({success: false, message: "Username and a password of at least 6 characters are required"});
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(409).json({success: false, message: "Username is already registered"});
        }

        const user = await User.create({
            username,
            passwordHash: await bcrypt.hash(password, 12)
        });

        req.login(user, (error) => {
            if (error) return res.status(500).json({success: false, message: "Could not start session"});
            res.status(201).json({success: true, user: publicUser(user)});
        });
    }
    catch (error) {
        console.error("Error in register", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) return next(error);
        if (!user) return res.status(401).json({success: false, message: info?.message || "Invalid username or password"});

        req.login(user, (loginError) => {
            if (loginError) return next(loginError);
            res.json({success: true, user: publicUser(user)});
        });
    })(req, res, next);
});

router.post("/logout", (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        req.session.destroy(() => res.json({success: true, message: "Logged out"}));
    });
});

router.get("/me", (req, res) => {
    res.json({authenticated: req.isAuthenticated(), user: req.user ? publicUser(req.user) : null});
});

export default router;
