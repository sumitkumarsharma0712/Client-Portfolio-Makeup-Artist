const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect('mongodb+srv://sumitkumarsharma0712_db_user:5NcJ0M5Y0WFMiFrN@cluster0.hwo9atj.mongodb.net/?appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to MongoDB Database');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Define User Schema (For Login / Auth)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// POST: Booking Endpoint
app.post('/api/book', async (req, res) => {
    try {
        const { name, email, service, date } = req.body;
        
        if (!name || !email || !service || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newBooking = new Booking({ name, email, service, date });
        await newBooking.save();

        console.log('New Booking Request Saved:', { name, email, service, date });
        res.status(200).json({ message: 'Booking successfully saved to the database!' });
        
    } catch (error) {
        console.error('Server error saving booking:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// POST: Register Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully! You can now login.' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// POST: Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User does not exist with that email' });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        res.status(200).json({ 
            message: 'Login successful!', 
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

module.exports = app;
