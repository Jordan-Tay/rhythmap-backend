const express = require("express");
const firebase = require("firebase");
const cors = require("cors");
const Utils = require("./utils");
const axios = require("axios");
const spotifyConfig = require("./spotifyConfig");
const firebaseConfig = require("./firebaseConfig");

const port = 9000;
const app = express();

const spotifyTokenURI = "https://accounts.spotify.com/api/token";

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

app.use(cors());
app.use(express.json());

app.post("/test", (req, res) => {
  console.log(req.body);
  let ref = database.ref("rhythms/" + req.body.lap.length);
  let promise;

  promise = Utils.getMapping(req.body.lap, ref);
  promise.then(p => {
    console.log(p);
    res.send(p);
  })
});

app.post("/getAccessToken", (req, res) => {
  const { clientId, clientSecret } = spotifyConfig;
  const clientCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  console.log(clientCredentials);
  axios.post(spotifyTokenURI, "grant_type=client_credentials", {
    headers: {
      "Authorization": `Basic ${clientCredentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(({ data }) => {
    res.send(data.access_token);
  }).catch(e => console.log(e));
});

app.post("/submit", (req, res) => {
  var ref = database.ref("rhythms/" + req.body.lap.length);
  ref.push(req.body);
  console.log("Added to database");
  res.send(true);
});

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});

