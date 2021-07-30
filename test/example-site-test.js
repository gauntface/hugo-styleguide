const path = require('path');
const test = require('ava');
const StaticServer = require('static-server');
const puppeteer = require('puppeteer');

const server = new StaticServer({
  rootPath: path.join(__dirname, 'example-site', 'public'),
  port: 9999,
});

function startServer() {
  return new Promise((resolve, reject) => {
    server.start(() => {
      console.log(`Using http://localhost:${server.port}`);
      resolve(`http://localhost:${server.port}`);
    })
  });
};

let addr;
let browser
test.before(async (t) => {
  // Server for project
  addr = await startServer();
});
test.before(async (t) => {
  // Start browser
  browser = await puppeteer.launch();
})

test.after('cleanup', async (t) => {
  // This runs before all tests
  server.stop();

  await browser.close();
});

test.beforeEach(async (t) => {
  // Create new page for test
  t.context.page = await browser.newPage();

  // Ensure we get 200 responses from the server
  t.context.page.on('response', (response) => {
    if (response) {
      t.deepEqual(response.status(), 200);
    }
  })
});

test.afterEach(async (t) => {
  await t.context.page.close();
})

test('color grid', async (t) => {
  const page = t.context.page;

  // Load webpage
  await page.goto(`${addr}/variables/colors/`);

  const swatches = await page.$$('.n-hopin-styleguide-c-swatch')
  t.deepEqual(swatches.length, 4);

  const vars = [];
  const vals = [];
  for(const s of swatches) {
    const varTxt = await s.evaluate((s) => s.querySelector('.n-hopin-styleguide-c-swatch__var-value').textContent);
    vars.push(varTxt);

    const valTxt = await s.evaluate((s) => s.querySelector('.n-hopin-styleguide-c-swatch__hex-value').textContent);
    vals.push(valTxt);
  }

  t.deepEqual(vars, ['--badass', '--coffee', '--rgb-demo', '--rgba-demo']);
  t.deepEqual(vals, ['#BADA55', '#C0FFEE', 'rgb(255, 255, 255)', 'rgba(1,2,3,0.4)']);
})

test('dimensions grid', async (t) => {
  const page = t.context.page;

  // Load webpage
  await page.goto(`${addr}/variables/dimensions/`);
  const rows = await page.$$('.n-hopin-styleguide-js-dimensions-grid tbody > tr')
  t.deepEqual(rows.length, 2);

  const vars = [];
  const vals = [];
  for(const row of rows) {
    const varTxt = await row.evaluate((row) => row.querySelectorAll('td')[0].textContent);
    vars.push(varTxt);

    const valTxt = await row.evaluate((row) => row.querySelectorAll('td')[1].textContent);
    vals.push(valTxt);
  }

  t.deepEqual(vars, ['--theme-example', '--padding']);
  t.deepEqual(vals, ['1234px', '16px']);
})

test('fonts grid', async (t) => {
  const page = t.context.page;

  // Load webpage
  await page.goto(`${addr}/variables/fonts/`);
  const rows = await page.$$('.n-hopin-styleguide-js-fonts-grid tbody > tr')
  t.deepEqual(rows.length, 1);

  const vars = [];
  const vals = [];
  for(const row of rows) {
    const varTxt = await row.evaluate((row) => row.querySelectorAll('td')[0].textContent);
    vars.push(varTxt);

    const valTxt = await row.evaluate((row) => row.querySelectorAll('td')[1].textContent);
    vals.push(valTxt);
  }

  t.deepEqual(vars, ['--font-family']);
  t.deepEqual(vals, ['"Robot", "Open Sans", sans-serif']);
})

test('typography display', async (t) => {
  const page = t.context.page;

  // Load webpage
  await page.goto(`${addr}/html/typography/`);
  const elements = await page.$$('.n-hopin-styleguide-js-typography > *')

  for(const el of elements) {
    const childCount = await el.evaluate((el) => el.childElementCount);
    if (childCount > 0) {
      const fontElType = await el.evaluate((el) => el.children[0].localName);
      const textContent = await el.evaluate((el) => el.querySelector('.n-hopin-styleguide-js-font-details').textContent);
      if (fontElType == "code") {
        t.truthy(textContent.indexOf(`: monospace`) == 0)
      } else {
        t.truthy(textContent.indexOf(`: "Times New Roman"`) == 0)
      }
    } else {
      const origText = await el.evaluate((el) => el.getAttribute('n-hopin-styleguide-typograhy_orig_text'));
      const textContent = await el.evaluate((el) => el.textContent);
      t.truthy(textContent.indexOf(`${origText}: "Times New Roman"`) == 0)
    }
  }
})
