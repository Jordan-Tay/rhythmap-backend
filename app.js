const express = require("express");
const firebase = require("firebase");
const Utils = require("./utils");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 9000;

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/test", (req, res) => {
  console.log(req.body);
  var ref = database.ref("rhythms/" + req.body.lap.length);
  var promise;

  promise = Utils.check(req.body.lap, ref);
  promise.then(p => {
    res.send(p);
  })
})

app.post("/submit", (req, res) => {
  var ref = database.ref("rhythms/" + req.body.lap.length);
  ref.push(req.body);
  console.log("Added to database");
})

app.listen(port, () => console.log(`Listening on port ${port}`));