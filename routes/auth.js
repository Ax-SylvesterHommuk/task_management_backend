import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../Database/database.js';

const router = express.Router();

const saltRounds = 10;

router.post('/api/users', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send('Email and password are required');
        return;
    }

    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            res.status(409).send('An account with this email already exists');
            return;
        }

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                next(err);
                return;
            }

            pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                res.status(201).send('Account created successfully');
            });
        });
    });
});

export default router;