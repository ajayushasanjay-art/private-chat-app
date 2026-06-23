const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        // இங்க Plain text-ஆகவே யூசர் மற்றும் பாஸ்வேர்டை செக் செய்கிறோம்
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            req.session.user = { id: user.id, username: user.username };
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Invalid Username or Password!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;