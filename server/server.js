require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL
const serverPort = process.env.SERVER_PORT
const routes = require('./routes/taskRoutes');

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json());
app.use('/api', routes)

app.listen(serverPort, () => {
    console.log(`Server Started at ${serverPort}`)
})