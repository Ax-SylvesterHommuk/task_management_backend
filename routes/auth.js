import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../Database/database.js';

const router = express.Router();

const saltRounds = 10;

router.get('/api/sessions', (req, res) => {
    if (!req.session || !req.session.user || !req.session.active) {
        res.status(401).send('Unauthorized');
        return;
    }

    // Return the user and session ID as a JSON object
    res.json({
        user: req.session.user,
        sessionId: req.session.id
    });
});

router.post('/api/sessions', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send('Email and password are required');
        return;
    }

    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            next(err);
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid email or password');
            return;
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                next(bcryptErr);
                return;
            }

            if (!bcryptResult) {
                res.status(401).send('Invalid email or password');
                return;
            }

            // Create session for user
            req.session.user = email;
            req.session.active = true;

            console.log('Session data:', req.session);

            res.status(200).send('Logged in successfully');
        });
    });
});

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

            pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err, results) => {
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

router.delete('/api/sessions', (req, res) => {
    if (!req.session || !req.session.user || !req.session.active) {
        res.status(401).send('Either session has expired or you are not logged in');
        return;
    }

    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).send('Session destroyed successfully');
    });
});

// Tasks API
router.post('/api/tasks', (req, res) => {
    if (!req.session || !req.session.user || !req.session.active) {
        res.status(401).send('Unauthorized');
        return;
    }

    const email = req.session.user;
    const { title } = req.body;

    // Get the user's ID based on their email
    pool.query('SELECT id FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;

        // Insert the task into the tasks table
        pool.query('INSERT INTO tasks (title, user_id) VALUES (?, ?)', [title, userId], (error) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(201).send('Task created successfully');
        });
    });
});

router.get('/api/tasks', (req, res) => {
    if (!req.session || !req.session.user || !req.session.active) {
        res.status(401).send('Unauthorized');
        return;
    }

    const email = req.session.user;

    // Get the user's ID based on their email
    pool.query('SELECT id FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;

        // Get all tasks for the user
        pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200).json(results);
        });
    });
});

router.delete('/api/tasks/:taskId', (req, res) => {
    if (!req.session || !req.session.user || !req.session.active) {
        res.status(401).send('Unauthorized');
        return;
    }

    const email = req.session.user;
    const taskId = req.params.taskId;

    // Get the user's ID based on their email
    pool.query('SELECT id FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userId = results[0].id;

        // Delete the task with the specified ID and user ID
        pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send('Task not found');
                return;
            }

            res.status(204).send('Task deleted successfully');
        });
    });
});

export default router;