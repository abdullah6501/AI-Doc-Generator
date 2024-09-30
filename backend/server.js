const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./dbconfig/db');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.log('Internal server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Register user
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// Login user
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN , { expiresIn: '1h' });
        res.json({ token });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});