const express = require('express')
const app = express()
const port = 3001
const mongoose = require('mongoose')
app.use(express.urlencoded({ extended: true }));
//to use the template engine
app.set('view engine', 'ejs');
// for the auto refresh feature
app.use(express.static('public'))

const routes = require("./routes/Routers");




// 4 auto refresh
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



//connrction to the database
mongoose
    .connect('mongodb+srv://entiqaaa:VDd8LITHv8Q8YhS3@entiqawebsite.h4txi.mongodb.net/?retryWrites=true&w=majority&appName=EntiqaWebsite')
    .then(() => {
        app.listen(port, () => {
            console.log(`http://localhost:${port}/`)
        })
    })
    .catch((err) => { console.log(err); });

app.use(routes);