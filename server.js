const express = require("express");
const app = express(); // <-- This line is missing in your code!
const cors = require("cors");

app.use(cors());
app.use(express.json());

// your /ask route and other code follows...
