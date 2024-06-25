const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();


const app = express();
app.use(cors({
    origin: 'https://map-render-client-2mff4n2ju-rohit2099s-projects.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));
app.use(express.json());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());

const {loginRouter} = require('./routes/login.js');
const imageRouter = require('./routes/image.js');
app.use('/api/users', loginRouter);
app.use('/api/captures', imageRouter);
debugger;

app.get("/", (req, res) => {
    debugger;
    res.status(200).send("Server started");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
