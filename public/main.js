// Ensure only one socket connection
let socket;

// Function to initialize socket connection
function initializeSocket() {
    // Close existing connection if any
    if (socket) {
        socket.disconnect();
    }

    // Create new connection
    socket = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: false
    });

    // Set up socket event listeners
    setupSocketListeners();
}

// Function to set up all socket event listeners
function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('Connected to server with socket ID:', socket.id);
        // Load previous messages when connected
        socket.emit('load-messages', 'general');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('clients-total', (total) => {
        clientsTotal.textContent = `Total Clients: ${total}`;
    });

    // Listen for previous messages
    socket.on('previous-messages', (messages) => {
        // Clear loading message
        messageContainer.innerHTML = '';

        if (messages.length === 0) {
            messageContainer.innerHTML = '<li class="message-info"><p>No previous messages. Start the conversation!</p></li>';
            return;
        }

        messages.forEach(message => {
            const isOwnMessage = message.sender === username;
            addMessageToUI(isOwnMessage, {
                name: message.sender,
                message: message.content,
                dateTime: message.createdAt
            });
        });
    });

    // Listen for message sent confirmation
    socket.on('message-sent', (data) => {
        // Message was successfully saved and sent
        console.log('Message sent successfully:', data);
    });

    // Listen for errors
    socket.on('error', (errorMessage) => {
        console.error('Socket error:', errorMessage);
        // Clear loading message and show error
        messageContainer.innerHTML = '<li class="message-error"><p>Error loading messages. Please refresh the page.</p></li>';
    });

    socket.on('chat-message', (data) => {
        addMessageToUI(false, data);
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
}

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

// Show loading message
messageContainer.innerHTML = '<li class="message-loading"><p>Loading previous messages...</p></li>';

// Initialize socket connection
initializeSocket();

// Handle page visibility change (when user switches tabs or minimizes)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, disconnect socket
        if (socket) {
            socket.disconnect();
        }
    } else {
        // Page is visible again, reconnect socket
        initializeSocket();
    }
});

// Handle page unload (refresh, close, navigate away)
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.disconnect();
    }
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === '' || nameInput.value === '') return;

    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    const data = {
        name: username, // Always use the username from localStorage
        message: messageText,
        dateTime: new Date(),
        room: 'general'
    };

    // Clear input immediately for better UX
    messageInput.value = '';

    // Add message to UI optimistically
    addMessageToUI(true, data);

    // Send to server
    if (socket && socket.connected) {
        socket.emit('message', data);
    } else {
        console.error('Socket not connected, attempting to reconnect...');
        initializeSocket();
        // Retry sending message after a short delay
        setTimeout(() => {
            if (socket && socket.connected) {
                socket.emit('message', data);
            }
        }, 1000);
    }
}

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
    if (socket && socket.connected) {
        socket.emit('feedback', { feedback: nameInput.value ? `${nameInput.value} is typing...` : '' });
    }
});

messageInput.addEventListener('keypress', () => {
    if (socket && socket.connected) {
        socket.emit('feedback', { feedback: nameInput.value ? `${nameInput.value} is typing...` : '' });
    }
});

messageInput.addEventListener('blur', () => {
    if (socket && socket.connected) {
        socket.emit('feedback', { feedback: '' });
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
        if (socket) {
            socket.disconnect();
        }
        localStorage.clear();
        window.location.href = '/login.html';
    });
}