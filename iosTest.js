// const { webkit } = require('playwright');

// (async () => {
//   const browser = await webkit.launch({ headless: false });
//   const context = await browser.newContext({
//     viewport: { width: 390, height: 844 },
//     userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
//   });

//   const page = await context.newPage();
//   await page.goto('http://127.0.0.1:3000'); // به جای localhost
// })();


const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://console.liara.ir');  // سایت آنلاین
})();