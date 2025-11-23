const puppeteer = require("puppeteer");

const run = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("http://google.com", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  const pdfBuffer = await page.pdf({
    printBackground: true,
    paperFormat: "A4",
    margin: {
      bottom: "10px",
      top: "10px",
      left: "10px",
      right: "10px",
    },
  });

  await browser.close();

  const buffer = Buffer.from(pdfBuffer);
  return buffer;
};

module.exports = {
  run,
};
