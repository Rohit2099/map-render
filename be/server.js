const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const captureRoutes = require('./routes/image');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/captures', captureRoutes);

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.error(error));