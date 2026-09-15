const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const targetUrl = 'http://localhost:3000';
const artifactDir = process.env.PW_ARTIFACT_DIR || os.tmpdir();

(async () => {
  const browser = await chromium.launch({ headless: false });
  try {
    const page = await browser.newPage();
    await page.goto(targetUrl + '/catalog');

    // Wait for product cards
    await page.waitForSelector('.grid.gap-6', { timeout: 5000 });

    // Find product cards
    const productCards = await page.$$eval('div.grid.gap-6', elements => {
      return elements.map(el => {
        const linkEl = el.querySelector('a');
        const titleEl = el.querySelector('a.text-xs.font-medium');
        const imgEl = el.querySelector('img');
        return {
          hasLink: !!linkEl,
          hasImage: !!imgEl,
          title: titleEl?.textContent?.trim() || '',
          href: linkEl?.href || ''
        };
      });
    });

    console.log('Found', productCards.length, 'product cards');
    productCards.forEach((card, index) => {
      console.log('Card ' + (index + 1) + ': ' + card.title + ' href: ' + card.href);
    });

    if (productCards.length > 0) {
      await page.goto(productCards[0].href);
      const newUrl = page.url();
      console.log('Navigated to: ' + newUrl);
      console.log('Is product page: ' + newUrl.includes('/product/'));

      await page.screenshot({ path: path.join(artifactDir, 'product-page.png'), fullPage: true });
    } else {
      console.log('No product cards found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();