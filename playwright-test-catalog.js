const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const targetUrl = 'http://localhost:3000';
const artifactDir = process.env.PW_ARTIFACT_DIR || os.tmpdir();

(async () => {
  const browser = await chromium.launch({ headless: false });
  try {
    const page = await browser.newPage();
    console.log('Navigating to catalog page...');
    await page.goto(targetUrl + '/catalog');

    console.log('Page title:', await page.title());

    // Take initial screenshot
    await page.screenshot({ path: path.join(artifactDir, 'catalog-page.png'), fullPage: true });

    // Wait for products to load
    await page.waitForSelector('.grid-cols-1', { timeout: 5000 });

    // Find product cards - using more specific selectors
    console.log('Looking for product cards...');
    const productCards = await page.$$eval('div.grid.gap-6', elements => {
      return elements.map(el => {
        const titleEl = el.querySelector('a.text-xs.font-medium');
        const linkEl = el.querySelector('a.text-xs.font-medium');
        const imgEl = el.querySelector('img');
        return {
          hasLink: !!linkEl,
          hasImage: !!imgEl,
          hasClickArea: el.style.cursor === 'pointer' || el.onclick !== null,
          title: titleEl?.textContent?.trim() || '',
          href: linkEl?.href || '',
          imgSrc: imgEl?.src || ''
        };
      });
    });

    console.log('Found', productCards.length, 'product cards');
    productCards.forEach((card, index) => {
      console.log(`Card ${index}:`, {
        hasLink: card.hasLink,
        hasImage: card.hasImage,
        title: card.title,
        hasHref: !!card.href,
        href: card.href,
        imgSrc: card.imgSrc
      });
    });

    if (productCards.length > 0) {
      console.log('\nTesting click on first product card...');
      const firstCard = productCards[0];

      // Try clicking on the title link
      if (firstCard.hasLink && firstCard.href) {
        console.log('Clicking on link:', firstCard.href);

        // Open in new tab to avoid navigation
        await page.evaluate(href => {
          window.open(href, '_blank');
        }, firstCard.href);

        // Wait for new page to load
        await page.waitForTimeout(2000);

        // Check if we're on a new page
        const newUrl = page.url();
        console.log('Current URL after click:', newUrl);

        // Check if it's a product page
        if (newUrl.includes('/product/')) {
          console.log('✓ Successfully navigated to product page');
          // Close the new tab/page
          await page.close();
          // Reopen catalog
          await page.goto(targetUrl + '/catalog');
        } else {
          console.log('✗ Still on catalog page or failed to navigate');
        }
      } else {
        console.log('✗ No link found in first product card');
      }
    } else {
      console.log('✗ No product cards found');
    }

    // Take final screenshot
    await page.screenshot({ path: path.join(artifactDir, 'catalog-final.png'), fullPage: true });

  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: path.join(artifactDir, 'error.png'), fullPage: true });
  } finally {
    await browser.close();
  }
})();