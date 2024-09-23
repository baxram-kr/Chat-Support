const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your token from BotFather
const token = '';
const bot = new TelegramBot(token, { polling: true });

// Create an Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public'));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission
app.post('/send-message', (req, res) => {
    const { chatId, message } = req.body;

    // Send the message to the specified chat ID
    bot.sendMessage(chatId, message)
        .then(() => {
            // Respond back to the client
            res.json({ status: 'success', message: 'Message sent successfully.' });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).json({ status: 'error', message: 'Failed to send message.' });
        });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Telegram bot functionality
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the support bot! How can I help you?');
});

// Handle incoming messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    console.log(`Message from ${chatId}: ${userMessage}`); // Log message in console

    // Replace with your group chat ID
    const groupChatId = ''; 

    // Forward the message to the group
    bot.sendMessage(groupChatId, `User ${chatId}: ${userMessage}`);

    // Example response to the user
    if (msg.text.toLowerCase().includes('help')) {
        bot.sendMessage(chatId, 'Please describe your issue or type /faq for frequently asked questions.');
    } else {
        bot.sendMessage(chatId, 'Thank you for your message! We will get back to you shortly.');
    }
});
