const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html'));
});

// API Routes (placeholder for future AI endpoints)
app.get('/api/metrics', (req, res) => {
    res.json({
        revenue: 45231,
        users: 2345,
        conversionRate: 3.2,
        tasksCompleted: 89
    });
});

app.get('/api/insights', (req, res) => {
    res.json({
        insight: 'Your conversion rate is up 15% this week. Consider scaling your marketing budget on high-performing campaigns.',
        confidence: 0.87
    });
});

app.listen(PORT, () => {
    console.log(`VelocityOS server running on http://localhost:${PORT}`);
});
