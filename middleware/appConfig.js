require('dotenv').config();
const express = require("express");
const path = require("path");
const session = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require("cors");


const defaultConnection = mongoose.createConnection(process.env.MONGODB_URI);

// Handle default connection events
defaultConnection.on('connected', () => {
  console.log('Default connection to MongoDB Atlas established.');
});

defaultConnection.on('error', (err) => {
  console.error('Error in default MongoDB connection:', err.message);
});

defaultConnection.on('disconnected', () => {
  console.log('Default MongoDB connection disconnected.');
});


const configureApp = () => {
  const app = express();
  console.log("CORS Origin:", process.env.FRONTEND_URL);



  const corsOptions = {
    origin: function (origin, callback) {
      console.log("Request Origin:", origin);
      if (!origin || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Handle preflight
  

  app.set("trust proxy", 1);

  app.use(session({
    secret: process.env.SESSION_SECRET || 'sldkfjsdhkjsdh23498uasjdhf', 
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 15 * 24 * 60 * 60, 
      autoRemove: 'interval',
      autoRemoveInterval: 15 
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 24 * 60 * 60 * 1000 // Set cookie expiration time (15 days)
    }
  }));
  
  app.use(express.json()); // Used when parsing JSON in client side
  app.use(express.urlencoded({ extended: true })); // Used when reading directly from form
  
 
  

  
  
  // app.use(cors())
  
  return app;
};

module.exports = {
  configureApp,
  defaultConnection
};
