const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const authRoutes = require('../routes/authRoutes');
const pinRoutes = require('../routes/pinRoutes');
const mongoose = require('mongoose');

app.use(cookieParser());

const corsOptions = {
  origin: `http://localhost:3000`,
  credentials: true, // included credentials as true
};

app.use(cors(corsOptions));

app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'})); 

mongoose.connect(config.databaseURL)
  .then(() => console.log('Connected to database'));
  
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/pins', pinRoutes);
app.get('/', (req, res) => {
  res.send('PinEcho API');
});

module.exports = app;