const {  configureApp } = require("./config/appConfig");
const authRoutes       = require("./routes/auth.route");
const pdfRoutes        = require("./routes/pdfRoutes");

const app = configureApp();

app.get("/ping", (req, res) => {
  res.status(204).end(); 
});

app.get("/api/ping", (req, res) => {
  res.send("man of the math of the tournament of the cricket")
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use("/",authRoutes);
app.use("/auth", authRoutes);
app.use('/api', pdfRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
