import express, {json} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';

import addParkRoutes from "./routes/addParkRoutes.js";
import searchParkRoutes from "./routes/searchParkRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";
import {connectDB} from "./config/db.js";


dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(json());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET || "parkIN-local-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7}
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/addpark',addParkRoutes);
app.use('/api/searchpark',searchParkRoutes);

if(connectDB()) {
    app.listen(port, () => {
        console.log(`app started in local host ${port}`);
    })
}