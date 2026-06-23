const socket = io();
let currentUser = '';

fetch('/auth/me')
    .then(res => res.json())
    .then(data => {
        if (!data.loggedIn) {
            window.location.href = '/login.html';
        } else {
            currentUser = data.user.username;
            document.getElementById('myUsername').innerText = currentUser;
        }
    });

const chatForm = document.getElementById('chatForm');
const msgInput = document.getElementById('msgInput');
const chatMessages = document.getElementById('chatMessages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (msgInput.value.trim() !== '') {
        const msgData = {
            sender: currentUser,
            text: msgInput.value
        };
        socket.emit('chatMessage', msgData);
        msgInput.value = '';
    }
});

socket.on('chatMessage', (msg) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    if (msg.sender === currentUser) {
        msgDiv.classList.add('sent');
    } else {
        msgDiv.classList.add('received');
    }

    msgDiv.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});