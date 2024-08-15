const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebRequestsQueue = require('./web-requests-queue');

const app = express();
const port = 3030;
const queue = new WebRequestsQueue();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.listen(port, async () => {
  await queue.start();
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("API server is running");
});

app.post("/browse", async (req, res) => {
  console.log(req.body);
  const url = req.body.url;
  const headers = req.body.headers || [];
  const method = req.body.method || 'GET';
  const request = { url, headers, method };
  const requestId = await queue.pushRequest(request);

  // wait 30 seconds for the request to be processed, check every 70ms
  let status = 0;
  let result = null;
  const startTime = new Date();
  while(status == 0 && (new Date() - startTime) < 30000) {
    await new Promise((resolve) => setTimeout(resolve, 70));
    status = await queue.getRequestStatus(requestId);
    if (status == 1) {
      result = await queue.getRequestResult(requestId);
    }
  }

  await queue.deleteRequest(requestId);

  if (status == 0) {
    return res.status(504).json({ code: 504, message: 'Request timeout' });
  }

  if (status == 1) {
    return res.status(200).json(result);
  }
});

app.use((req, res) => { res.status(404).json({ code: 404, message: 'Not Found' }) })