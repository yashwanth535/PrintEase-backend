import { configureApp } from "./config/app.config.js";
import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import vendorsRoutes from "./routes/vendors.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { checkMongoConnection } from "./config/mongo.config.js";
import userRoutes from "./routes/user.routes.js";
import path from 'path';
import { fileURLToPath } from 'url'; // If using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { loadEnv } from './config/loadenv.js';
loadEnv();

import express from 'express';


const startServer = async () => {
const app = await configureApp();


app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use('/api/vendor',vendorRoutes);
app.use('/api/user',userRoutes);
app.use('/api/vendors',vendorsRoutes);
app.use('/api/order',orderRoutes);


app.get("/ping", (req, res) => {
  res.status(204).end(); 
});

app.get("/api/ping", (req, res) => {
  res.send("printease backend api is running")
});


app.get('/api/db',checkMongoConnection);


if(process.env.docker){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/', 'index.html'));
  });
}


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
}

startServer();
