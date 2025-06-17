const socket = io('http://localhost:3000');

const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Set username from localStorage and make input read-only
const username = localStorage.getItem('username') || 'anonymous';
nameInput.value = username;
nameInput.readOnly = true;

messageContainer.innerHTML = '';

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (total) => {
    clientsTotal.textContent = `Total Clients: ${total}`;
});

function sendMessage() {
    if (messageInput.value === '' || nameInput.value === '') return;
    const data = {
        name: username, // Always use the username from localStorage
        message: messageInput.value,
        dateTime: new Date()
    };
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
                ${data.message}
                <span>${data.name}  ${moment(data.dateTime).fromNow()}</span>
            </p>
        </li>`;
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', { feedback: nameInput.value ? `${nameInput.value} is typing...` : '' });
});

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', { feedback: nameInput.value ? `${nameInput.value} is typing...` : '' });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', { feedback: '' });
});

socket.on('feedback', (data) => {
    clearFeedback();
    if (data.feedback) {
        const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>`;
        messageContainer.innerHTML += element;
        scrollToBottom();
    }
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    });
}

// Logout button logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login.html';
    });
}