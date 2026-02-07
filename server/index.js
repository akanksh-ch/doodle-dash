const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('draw-line', (data) => {
        // Broadcast to all other clients, excluding the sender
        socket.broadcast.emit('draw-line', data);
    });

    socket.on('clear', () => {
        io.emit('clear');
    });

    let timerInterval;
    let timeLeft = 30;

    socket.on('start-game', () => {
        io.emit('start-game');
        io.emit('clear');

        // Reset Timer
        timeLeft = 30;
        clearInterval(timerInterval);

        io.emit('timer-update', timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            io.emit('timer-update', timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                io.emit('time-up'); // Client should handle this, maybe auto-guess or just show "Time's Up"
            }
        }, 1000);
    });

    socket.on('end-game', (result) => {
        clearInterval(timerInterval); // Stop timer if game ends early
        io.emit('game-over', result);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.use(express.json({ limit: '10mb' }));

app.post('/api/guess', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Image comes as "data:image/png;base64,..."
        // We need to strip the prefix for the API if using inlineData, 
        // but the Node SDK helper might expect the raw buffer or specific format.
        // For simple inline data:
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = "You are a party game player. Guess what this drawing represents in 1-3 words. Be funny if the drawing is bad.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/png",
                },
            },
        ]);
        const response = await result.response;
        const text = response.text();

        res.json({ guess: text.trim() });
    } catch (error) {
        console.error('Error calling Gemini:', error);
        res.status(500).json({ error: 'Failed to generate guess' });
    }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
