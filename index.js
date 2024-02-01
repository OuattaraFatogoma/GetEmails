require('dotenv').config();
const express = require('express');
const path = require('path');
const bot = require('./bot');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/scrape', bot);


app.listen(port, console.log(`Server is listening on ${port}`));