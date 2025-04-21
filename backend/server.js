const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const corsOptions = require("./corsOptions");
const credentials = require("./credentials");
const prove = require("./logic");

const http = require("http");
const server = http.createServer(app);

// set port equal to 3005
const PORT = process.env.PORT || 3005;

// cors + credentinals
app.use(credentials);
app.use(cors(corsOptions));

// jshow json and etc
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// router
app.use("/", require('./route'));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
