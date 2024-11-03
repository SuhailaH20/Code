const express = require('express');
const app = express();
const port = 3003;
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));

// For session
const session = require('express-session');

// To use the template engine
app.set('view engine', 'ejs');

// Auto-refresh feature
app.use(express.static('public'));
app.use(express.json());
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

app.use(routes);


