const path = require('path');
const test = require('ava');
const StaticServer = require('static-server');
const puppeteer = require('puppeteer');

const server = new StaticServer({
  rootPath: path.join(__dirname, '..', 'example', 'public'),
  port: 9999,
});

function startServer() {
  return new Promise((resolve, reject) => {
    server.start(() => {
      resolve(`http://localhost:${server.port}`);
    })
  });
};

test('color grid', async (t) => {
  t.timeout(30 * 1000);

  // Server of project
  const addr = await startServer();

  // Start browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load webpage
  await page.goto(`${addr}/variables/colors/`);
  const swatches = await page.$$('.n-hopin-styleguide-c-swatch')
  t.deepEqual(swatches.length, 1);

  const vars = [];
  const hexs = [];
  for(const s of swatches) {
    const varTxt = await s.evaluate((s) => s.querySelector('.n-hopin-styleguide-c-swatch__var-value').textContent);
    vars.push(varTxt);

    const hexTxt = await s.evaluate((s) => s.querySelector('.n-hopin-styleguide-c-swatch__hex-value').textContent);
    hexs.push(hexTxt);
  }

  t.deepEqual(vars, ['--coffee']);
  t.deepEqual(hexs, ['#C0FFEE']);

  await browser.close();
  server.stop();
})
