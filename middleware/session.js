import expressSession from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Set up express-session middleware
const sessionMiddleware = expressSession({
    genid: (req) => {
        return uuidv4(); // use UUIDs for session IDs
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
});

// Middleware to handle user sessions
const sessionHandler = (req, res, next) => {
    sessionMiddleware(req, res, () => {
        req.session.active = true;
        next();
    });
};

export { sessionMiddleware, sessionHandler };