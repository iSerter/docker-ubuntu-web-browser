const Xvfb = require("xvfb");
const puppeteer = require("puppeteer");

const stopSession = async (xvfbSession) => {
  try {
    xvfbSession && xvfbSession.stopSync();
  } catch (err) {}
  return true;
};

const startSession = ({ args = [], customConfig = {}, proxy = {} }) => {
  return new Promise(async (resolve, reject) => {
    try {
      var xvfbSession = null;
      var chromePath =
        customConfig.executablePath ||
        customConfig.chromePath ||
        puppeteer.executablePath();

      try {
        var xvfbSession = new Xvfb({
          silent: true,
          xvfb_args: ["-screen", "0", "1920x1080x24", "-ac"],
        });
        xvfbSession.startSync();
      } catch (err) {
        console.error("Error starting Xvfb", err);
      }

      const chromeFlags = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1920,1080",
      ].concat(args);

      if (proxy && proxy.host && proxy.host.length > 0) {
        chromeFlags.push(`--proxy-server=${proxy.host}:${proxy.port}`);
      }

      const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        args: chromeFlags,
        env: {
            DISPLAY: xvfbSession._display
        },
        ...customConfig,
      });

      browser.on("disconnected", () => {
        console.log("Browser disconnected");
        stopSession(xvfbSession);
      });

      return resolve({
        browser,
        xvfbSession,
      });
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  });
};

module.exports = {
    stopSession,
    startSession,
};