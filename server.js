const {  configureApp } = require("./config/app.config");
const authRoutes        = require("./routes/auth.routes");
const pdfRoutes         = require("./routes/pdf.routes");
const vendorRoutes      = require("./routes/vendor.routes");
const vendorsRoutes     = require("./routes/vendors.routes");
const {checkMongoConnection} = require("./config/mongo.config");
const userRoutes        = require("./routes/user.routes");

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
app.use('/api/file', pdfRoutes);
app.use('/api/vendor',vendorRoutes);
app.use('/api/user',userRoutes);
app.use('/api/vendors',vendorsRoutes);
app.use('/api/upload-file',pdfRoutes);


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
