const { startSession, stopSession } = require('./browser/puppeteer-chrome-xvfb');
const WebRequestsQueue = require('./web-requests-queue.js');

const handleRequests = async () => {
  const queue = new WebRequestsQueue();
  await queue.start();
//   const { browser, xvfbSession } = await startSession({});

//   const reqId = await queue.pushRequest({url: "http://iserter.com"});
//   console.log(reqId);
//   console.log(await queue.getRequestStatus(reqId));
//   console.log(await queue.updateRequestResult(reqId, 'wow'));
//   console.log(await queue.updateRequestStatus(reqId, 1));
//   console.log('result',await queue.getRequestResult(reqId));
//   console.log(await queue.getRequestStatus(reqId));
//   console.log('del',await queue.deleteRequest(reqId));
//   console.log(await queue.getRequestStatus(reqId), await queue.getRequestResult(reqId));
//   console.log(await queue.getRequests());


//   return;

  while (true) {
    try {
      const requests = await queue.getRequests();
      for (const request of requests) {
        if (request.status == '0') {
          // Process the request
          const page = await browser.newPage();
          await page.goto(request.data.url);
          const result = await page.content();
          queue.updateRequestResult(request.id, result);
          queue.updateRequestStatus(request.id, 1);
          await page.close();
        }
      }
    } catch (err) {
      console.error('Error handling requests:', err);
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  await stopSession(xvfbSession);
};

handleRequests().catch(err => console.error('Error in handleRequests:', err));