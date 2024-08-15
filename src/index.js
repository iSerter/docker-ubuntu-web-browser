const express = require("express"),
  app = express(),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  port = process.env.PORT || 3030;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("API server is running");
});

app.post("/browse", (req, res) => {
  console.log(req.body);
  const url = req.body.url;
  const headers = req.body.headers;
  const method = req.body.method;
  res.send(`To be implemented. URL: ${url}, headers: ${headers}, method: ${method}`);
});

app.use((req, res) => { res.status(404).json({ code: 404, message: 'Not Found' }) })