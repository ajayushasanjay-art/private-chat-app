const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectRoute = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// .env ஃபைல் வேலை செய்யவில்லை என்றாலும், தற்காலிகமாக இந்த கீ வேலை செய்யும்
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SESSION_SECRET || 'my_super_secret_backup_key_123';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionMiddleware = session({
    secret: SECRET, // இங்க மாத்தியாச்சு!
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use('/auth', authRoutes);

app.get('/chat.html', protectRoute, (req, res, next) => {
    next(); 
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

io.on('connection', (socket) => {
    console.log('ஒரு யூசர் கனெக்ட் ஆகிவிட்டார்! Socket ID:', socket.id);

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('ஒரு யூசர் டிஸ்கனெக்ட் ஆகிவிட்டார்.');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 சர்வர் மாஸாக ஓடிக்கொண்டிருக்கிறது: http://localhost:${PORT}`);
});