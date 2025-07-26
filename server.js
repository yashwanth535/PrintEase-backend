import { configureApp } from "./config/app.config.js";
import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import vendorsRoutes from "./routes/vendors.routes.js";
import { checkMongoConnection } from "./config/mongo.config.js";
import userRoutes from "./routes/user.routes.js";

const startServer = async () => {
const app = await configureApp();


app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});
app.get("/",(req,res)=>{
  res.send("Yashwanth Munikuntla")
})
app.use("/",authRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/vendor',vendorRoutes);
app.use('/api/user',userRoutes);
app.use('/api/vendors',vendorsRoutes);


app.get("/ping", (req, res) => {
  res.status(204).end(); 
});

app.get("/api/ping", (req, res) => {
  res.send("printease backend api is running")
});


app.get('/api/db',checkMongoConnection);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
}

startServer();
