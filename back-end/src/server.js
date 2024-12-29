const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();

// Veritabanı bağlantısı
connectDB();

const app = express();

// CORS ayarları
app.use(cors());  // Tüm originlere izin ver

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Middleware
app.use(bodyParser.json());

// Routes
const routeRoutes = require('./routes/routeRoutes');
app.use('/api/routes', routeRoutes);

// Ana endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'İstanbul Metro Rota Bulucu API',
        version: '1.0.0'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 