const {  configureApp } = require("./middleware/appConfig");
// const isAuthenticated    = require("./middleware/isAuthenticated")
const authRoutes       = require("./routes/auth.route");

const app = configureApp();
// Sample JSON Data
const data = [
  { id: 1, name: "vishnu", age: 25 },
  { id: 2, name: "varun", age: 30 },
  { id: 3, name: "charan", age: 22 }
];

app.get("/api/users", (req, res) => {
  res.json(data);
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use("/",authRoutes);
app.use("/auth", authRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
