const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from frontend

// Sample JSON Data
const data = [
  { id: 1, name: "vishnu", age: 25 },
  { id: 2, name: "varun", age: 30 },
  { id: 3, name: "charan", age: 22 }
];

// GET API to send JSON data
app.get("/api/users", (req, res) => {
  res.json(data);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
