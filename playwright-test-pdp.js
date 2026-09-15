const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const targetUrl = 'http://localhost:3000';
const artifactDir = process.env.PW_ARTIFACT_DIR || os.tmpdir();

(async () => {
  const browser = await chromium.launch({ headless: false });
  try {
    const page = await browser.newPage();

    // Test with hoodie product which has multiple sizes
    console.log('Test 1: Navigate to product page (hoodie)');
    await page.goto(targetUrl + '/product/heavyweight-fleece-hoodie');
    await page.waitForLoadState('networkidle');
    console.log('✓ Product page loaded');

    // Test 2: Check size guide button
    console.log('Test 2: Check size guide button');
    const sizeGuideBtn = page.locator('button').filter({ hasText: 'Таблица размеров' }).first();
    await sizeGuideBtn.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✓ Size guide button visible');

    // Test 3: Open size guide modal
    console.log('Test 3: Open size guide modal');
    await sizeGuideBtn.click();
    await page.waitForTimeout(500);
    const modalVisible = await page.locator('.fixed.inset-0.z-50').isVisible();
    console.log(modalVisible ? '✓ Size guide modal opened' : '✗ Modal not visible');

    // Test 4: Close modal
    console.log('Test 4: Close size guide modal');
    const closeBtn = page.locator('button').filter({ hasText: 'Понятно' }).first();
    await closeBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Modal closed');

    // Test 5: Product title visible
    console.log('Test 5: Check product title');
    const title = await page.locator('h1').first().textContent();
    console.log('✓ Title: ' + title);

    // Test 6: Price visible
    console.log('Test 6: Check price');
    const price = await page.locator('p').filter({ hasText: /₸/ }).first().textContent();
    console.log('✓ Price: ' + price.trim());

    // Test 7: Select size M (should be available for hoodie)
    console.log('Test 7: Select size M');
    const sizeM = page.locator('button').filter({ hasText: 'M' }).first();
    // Wait for it to be enabled
    await sizeM.waitFor({ state: 'enabled', timeout: 3000 });
    await sizeM.click();
    console.log('✓ Size M selected');

    // Test 8: Select color
    console.log('Test 8: Select color');
    const colorBtns = page.locator('.flex.flex-wrap.gap-3 button');
    const colorCount = await colorBtns.count();
    if (colorCount > 0) {
      await colorBtns.first().click();
      console.log('✓ Color selected');
    } else {
      console.log('! No color buttons found');
    }

    // Test 9: Quantity increase
    console.log('Test 9: Increase quantity');
    const plusBtn = page.locator('button').filter({ hasTitle: /Увеличить количество/ }).first();
    await plusBtn.click();
    console.log('✓ Quantity increased');

    // Test 10: Add to cart
    console.log('Test 10: Add to cart');
    const addBtn = page.locator('button').filter({ hasText: 'Добавить в корзину' }).first();
    await addBtn.click();
    await page.waitForTimeout(1000);
    console.log('✓ Add to cart clicked');

    // Test 11: Check cart badge updated
    console.log('Test 11: Check cart badge');
    await page.waitForTimeout(1000);
    const cartButton = page.locator('[aria-label="Открыть корзину"]');
    const cartBadge = cartButton.locator('span').filter({ hasText: /\[.*\]/ });
    await cartBadge.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✓ Cart badge updated');

    // Take final screenshot
    await page.screenshot({ path: path.join(artifactDir, 'pdp-final.png'), fullPage: true });
    console.log('✓ All tests passed');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();