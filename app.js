const express = require('express');
const app = express();
const port = 3003;
const mongoose = require('mongoose');
const axios = require('axios');
app.use(express.urlencoded({ extended: true }));

// For session
const session = require('express-session');

// To use the template engine
app.set('view engine', 'ejs');

// Auto-refresh feature
app.use(express.static('public'));

const routes = require("./routes/Routers");

// For auto-refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Connection to MongoDB 
mongoose
    .connect('mongodb+srv://entiqaaa:VDd8LITHv8Q8YhS3@entiqawebsite.h4txi.mongodb.net/?retryWrites=true&w=majority&appName=EntiqaWebsite')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Route to fetch business types and neighborhoods from Flask
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5001/'); // Flask root endpoint

        //test
        console.log(response.data);

        const activities = response.data.activities;
        const neighborhoods = response.data.neighborhoods;

        // Define a username retrieved from database
        const userName = req.session.userName;

        res.render('pages/Main', { activities, neighborhoods, userName });
    } catch (error) {
        console.error('Error fetching data from Flask:', error);
        res.status(500).send('Error fetching data from Flask');
    }
});

app.use(routes);


